import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from './firebase';

const googleProvider = new GoogleAuthProvider();

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  const handleEmailAuth = async () => {
    setError('');
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      navigate('/merchants');
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    }
  };

  const handleGoogle = async () => {
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/merchants');
    } catch (err) {
      setError(err.message.replace('Firebase: ', ''));
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.brandHeader}>
          <div style={styles.logoText}>
            <span style={styles.logoPin}>Pin</span>
            <span style={styles.logoPoint}>Point</span>
            <span style={styles.logoStar}>★</span>
          </div>
          <p style={styles.logoTagline}>Get to the points.</p>
        </div>

        <p style={styles.tagline}>Sign in to access your rewards</p>

        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.form}>
          <input
            style={styles.input}
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleEmailAuth()}
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleEmailAuth()}
          />
          <button style={styles.primaryBtn} onClick={handleEmailAuth}>
            {isRegistering ? 'Create Account' : 'Sign In'}
          </button>
        </div>

        <div style={styles.divider}><span>or</span></div>

        <button style={styles.googleBtn} onClick={handleGoogle}>
          <span style={{ fontSize: '1.1rem' }}>G</span> Continue with Google
        </button>

        <p style={styles.toggle} onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Already have an account? Sign in' : "Don't have an account? Register"}
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#f4f6f9', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  card: { backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', padding: '2.5rem', width: '100%', maxWidth: '380px' },
  brandHeader: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '0.25rem' },
  brandTitle: { fontSize: '2rem', fontWeight: '700', color: '#1a73e8', margin: '0.25rem 0 0' },
  brandSub: { color: '#666', fontSize: '1rem', margin: '0 0 1rem' },
  tagline: { textAlign: 'center', color: '#666', fontSize: '0.9rem', marginBottom: '1.5rem' },
  error: { backgroundColor: '#fdecea', color: '#c62828', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '1rem' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem' },
  input: { padding: '0.85rem 1rem', borderRadius: '8px', border: '1.5px solid #e0e0e0', fontSize: '0.95rem', outline: 'none' },
  primaryBtn: { padding: '0.85rem', borderRadius: '8px', border: 'none', backgroundColor: '#1a73e8', color: 'white', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' },
  divider: { textAlign: 'center', color: '#aaa', fontSize: '0.85rem', margin: '0.5rem 0', position: 'relative' },
  googleBtn: { width: '100%', padding: '0.85rem', borderRadius: '8px', border: '1.5px solid #e0e0e0', backgroundColor: 'white', fontSize: '0.95rem', fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' },
  toggle: { textAlign: 'center', color: '#1a73e8', cursor: 'pointer', fontSize: '0.875rem' },
  logoText: { display: 'flex', alignItems: 'center', marginBottom: '0.25rem' },
  logoPin: { fontSize: '2rem', fontWeight: '700', color: '#5cb85c' },
  logoPoint: { fontSize: '2rem', fontWeight: '700', color: '#1a2a4a' },
  logoStar: { fontSize: '1.4rem', color: '#1a73e8', marginLeft: '3px' },
  logoTagline: { color: '#666', fontSize: '0.9rem', margin: '0 0 1rem' },
};