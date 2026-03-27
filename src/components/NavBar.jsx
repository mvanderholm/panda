import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../AuthContext';
import logo from '../assets/logo.png';

export default function NavBar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const navItems = [
    { label: 'Merchants', path: '/merchants' },
    { label: 'Search', path: '/search' },
    { label: 'Rewards', path: '/rewards' },
    { label: 'Profile', path: '/profile' },
    { label: 'Admin', path: '/admin' },
  ];

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <div style={styles.brand} onClick={() => navigate('/merchants')}>
          <img src={logo} alt="PinPoint Rewards" style={styles.logo} />
        </div>
        <div style={styles.links}>
          {navItems.map(item => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  ...styles.link,
                  ...(isActive ? styles.activeLink : {}),
                }}
                onMouseEnter={e => {
                  if (!isActive) e.currentTarget.style.backgroundColor = '#f0f0f0';
                }}
                onMouseLeave={e => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {item.label}
                {isActive && <span style={styles.activeUnderline} />}
              </Link>
            );
          })}
        </div>
        <div style={styles.user}>
          <span style={styles.email}>{user?.email}</span>
          <button
            style={styles.signOut}
            onClick={handleSignOut}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#4cae4c'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#5cb85c'}
          >
            Sign Out
          </button>
        </div>
      </div>
      <div style={styles.bottomBorder} />
    </nav>
  );
}

const styles = {
  nav: {
    background: 'linear-gradient(135deg, #ffffff 0%, #f0f4f0 100%)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  bottomBorder: {
    height: '3px',
    background: 'linear-gradient(90deg, #5cb85c 0%, #1a73e8 50%, #1a2a4a 100%)',
  },
  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 2rem',
    height: '64px',
  },
  brand: { cursor: 'pointer', display: 'flex', alignItems: 'center' },
  logo: { height: '38px', objectFit: 'contain' },
  links: { display: 'flex', gap: '0.25rem' },
  link: {
    color: '#444',
    textDecoration: 'none',
    fontSize: '0.9rem',
    padding: '0.4rem 0.85rem',
    borderRadius: '6px',
    transition: 'all 0.15s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    position: 'relative',
    backgroundColor: 'transparent',
  },
  activeLink: {
    color: '#1a2a4a',
    fontWeight: '600',
    backgroundColor: 'transparent',
  },
  activeUnderline: {
    display: 'block',
    height: '2.5px',
    width: '100%',
    backgroundColor: '#5cb85c',
    borderRadius: '2px',
    position: 'absolute',
    bottom: '-2px',
    left: 0,
  },
  user: { display: 'flex', alignItems: 'center', gap: '1rem' },
  email: { color: '#666', fontSize: '0.8rem' },
  signOut: {
    padding: '0.4rem 0.9rem',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: '#5cb85c',
    color: 'white',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600',
    transition: 'background-color 0.15s',
  },
};