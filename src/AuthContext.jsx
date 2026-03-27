import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import { apiFetch } from './api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [customerId, setCustomerId] = useState(null);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    console.log('Firebase user:', firebaseUser?.email);
    setUser(firebaseUser);

    if (firebaseUser?.email) {
      try {
        const result = await apiFetch('GetCustomerIdByEmail', { 
          email: firebaseUser.email 
        });
        console.log('GetCustomerIdByEmail result:', result);
        if (result[0]?.RESPONSE?.CODE === 1) {
          console.log('Setting customerId:', result[0].customerId);
          setCustomerId(result[0].customerId);
        }
      } catch (err) {
        console.error('Could not fetch CustomerId:', err);
      }
    } else {
      setCustomerId(null);
    }

    setLoading(false);
  });
}, []);

  return (
    <AuthContext.Provider value={{ user, customerId }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);