import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';
import { useAuth } from './AuthContext';
import { apiFetch } from './api';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

useEffect(() => {
  console.log('useEffect fired');
  apiFetch('MerchantListing', { sMarket: 1 })
    .then(result => {
      console.log('API result:', result);
      setData(result);
    })
    .catch(err => {
      console.log('API error:', err.message);
      setError(err.message);
    });
}, []);

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Welcome!</h2>
        <p>Logged in as: <strong>{user?.email}</strong></p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {data && (
          <pre style={{ fontSize: '0.8rem', overflow: 'auto', maxHeight: '300px' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        )}
        <button style={styles.button} onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5' },
  card: { backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', gap: '1rem', width: '400px' },
  button: { padding: '0.75rem', borderRadius: '4px', border: 'none', backgroundColor: '#1a73e8', color: 'white', fontSize: '1rem', cursor: 'pointer' },
};