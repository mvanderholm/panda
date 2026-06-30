import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch, getMemberProfile } from './api';
import { recordError, setUserId } from './crashlytics';
import analytics from './analytics';


const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [marketId, setMarketId] = useState(1);
  const [loading, setLoading] = useState(true);

  // Record first launch date for app rating prompt gating
  useEffect(() => {
    AsyncStorage.getItem('first_launch_date').then(date => {
      if (!date) AsyncStorage.setItem('first_launch_date', String(Date.now()));
    });
  }, []);

  // CFC auth: restore session from storage on mount
  useEffect(() => {
    AsyncStorage.getItem('cfc_session')
      .then(raw => {
        if (raw) {
          const session = JSON.parse(raw);
          setUser(session.user);
          setCustomerId(session.customerId);
          if (session.marketId) setMarketId(session.marketId);
        }
      })
      .catch(err => {
        recordError(err);
        AsyncStorage.removeItem('cfc_session');
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const params = { authUser: btoa(email), authPassword: btoa(password) };
    const result = await apiFetch('UserLogin', params);
    const data = Array.isArray(result) ? result[0] : result;
    if (data?.CODE !== 1) {
      throw new Error(data?.DESCRIPTION || 'Login failed');
    }
    const id = data.CUSTOMER_ID;

    // Fetch profile to get market ID; fall back to 1 if unavailable
    let market = 1;
    try {
      const profile = await getMemberProfile(id);
      const p = Array.isArray(profile) ? profile[0] : profile;
      market = p?.MARKET_ID ?? 1;
    } catch (err) { recordError(err); }

    await AsyncStorage.setItem('cfc_session', JSON.stringify({ user: email, customerId: id, marketId: market }));
    setUser(email);
    setCustomerId(id);
    setMarketId(market);
    setUserId(String(id));
    analytics.setUser(id);
    analytics.track('login');

  };

  const logout = async () => {
    await AsyncStorage.removeItem('cfc_session');
    setUser(null);
    setCustomerId(null);
    setMarketId(1);
  };

  return (
    <AuthContext.Provider value={{ user, customerId, marketId, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
