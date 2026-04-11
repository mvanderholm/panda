import { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from './api';

// --- Firebase (disabled) ---
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth } from './firebase';
// --------------------------

// import { registerForPushNotifications } from './notifications';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [loading, setLoading] = useState(true);

  // CFC auth: restore session from storage on mount
  useEffect(() => {
    AsyncStorage.getItem('cfc_session')
      .then(raw => {
        if (raw) {
          const session = JSON.parse(raw);
          setUser(session.user);
          setCustomerId(session.customerId);
        }
      })
      .catch(err => console.error('Session restore error:', err))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const params = { authUser: btoa(email), authPassword: btoa(password) };
    const result = await apiFetch('UserLogin', params);
    const data = Array.isArray(result) ? result[0] : result;
    if (data?.CODE !== 1) {
      throw new Error(data?.DESCRIPTION || 'Login failed');
    }
    const id = data.CUSTOMER_ID ?? data.customer_id;
    await AsyncStorage.setItem('cfc_session', JSON.stringify({ user: email, customerId: id }));
    setUser(email);
    setCustomerId(id);

    // const token = await registerForPushNotifications();
    // if (token && id) {
    //   await apiFetch('SavePushToken', {
    //     CustomerId: id,
    //     PushToken: token,
    //     Platform: 'expo'
    //   });
    //   console.log('Push token saved:', token);
    // }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('cfc_session');
    setUser(null);
    setCustomerId(null);
  };

  // --- Firebase listener (disabled) ---
  // useEffect(() => {
  //   return onAuthStateChanged(auth, async (firebaseUser) => {
  //     setUser(firebaseUser);
  //     if (firebaseUser?.email) {
  //       try {
  //         const result = await apiFetch('GetCustomerIdByEmail', { email: firebaseUser.email });
  //         if (result[0]?.RESPONSE?.CODE === 1) {
  //           const id = result[0].customerId;
  //           setCustomerId(id);
  //         }
  //       } catch (err) {
  //         console.error('Auth setup error:', err);
  //       }
  //     } else {
  //       setCustomerId(null);
  //     }
  //     setLoading(false);
  //   });
  // }, []);
  // ------------------------------------

  return (
    <AuthContext.Provider value={{ user, customerId, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
