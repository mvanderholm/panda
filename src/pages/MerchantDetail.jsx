import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { apiFetch } from '../api';

export default function MerchantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [merchant, setMerchant] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch('MerchantDetail', { MerchantId: id, platformtype: 2 })
      .then(data => setMerchant(data[0]))
      .catch(err => setError(err.message));
  }, [id]);

  if (error) return <Layout><p style={{ color: 'red' }}>{error}</p></Layout>;
  if (!merchant) return (
    <Layout>
      <div style={styles.loading}>
        <div style={styles.spinner} />
        <p>Loading merchant...</p>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <button style={styles.back} onClick={() => navigate('/merchants')}>
        ← Back to Merchants
      </button>

      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroIcon}>{merchant.NAME.charAt(0)}</div>
        <div>
          <h1 style={styles.heroName}>{merchant.NAME}</h1>
          <p style={styles.heroAddress}>
            📍 {merchant.ADDRESS}, {merchant.CITY}, {merchant.STATE} {merchant.ZIP?.trim()}
          </p>
        </div>
      </div>

      <div style={styles.grid}>
        {/* Left column */}
        <div style={styles.leftCol}>

          {/* About */}
          {merchant.MERCHANT_DESCRIPTION && (
            <div style={styles.card}>
              <h2 style={styles.cardTitle}>About</h2>
              <p style={styles.description}>{merchant.MERCHANT_DESCRIPTION}</p>
            </div>
          )}

          {/* Contact */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Contact</h2>
            <div style={styles.contactGrid}>
              {merchant.PHONE1 && (
                <div style={styles.contactItem}>
                  <span style={styles.contactIcon}>📞</span>
                  <div>
                    <div style={styles.contactLabel}>Phone</div>
                    <a href={`tel:${merchant.PHONE1}`} style={styles.contactValue}>{merchant.PHONE1}</a>
                  </div>
                </div>
              )}
              {merchant.E_MAIL && (
                <div style={styles.contactItem}>
                  <span style={styles.contactIcon}>✉️</span>
                  <div>
                    <div style={styles.contactLabel}>Email</div>
                    <a href={`mailto:${merchant.E_MAIL}`} style={styles.contactValue}>{merchant.E_MAIL}</a>
                  </div>
                </div>
              )}
              {merchant.WEB_ADDRESS && (
                <div style={styles.contactItem}>
                  <span style={styles.contactIcon}>🌐</span>
                  <div>
                    <div style={styles.contactLabel}>Website</div>
                    <a href={`https://${merchant.WEB_ADDRESS}`} target="_blank" rel="noreferrer" style={styles.contactValue}>{merchant.WEB_ADDRESS}</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column - Perks */}
        <div style={styles.rightCol}>
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Perks & Rewards</h2>
            <div style={styles.perks}>
              {merchant.R_PERK && (
                <div style={{ ...styles.perk, ...styles.perkReward }}>
                  <div style={styles.perkHeader}>
                    <span>🏆</span>
                    <span style={styles.perkType}>Reward</span>
                  </div>
                  <p style={styles.perkText}>{merchant.R_PERK}</p>
                </div>
              )}
              {merchant.E_PERK && merchant.E_PERK !== 'none offered' && (
                <div style={{ ...styles.perk, ...styles.perkExclusive }}>
                  <div style={styles.perkHeader}>
                    <span>⭐</span>
                    <span style={styles.perkType}>Exclusive Perk</span>
                  </div>
                  <p style={styles.perkText}>{merchant.E_PERK}</p>
                </div>
              )}
              {merchant.A_PERK && (
                <div style={{ ...styles.perk, ...styles.perkBonus }}>
                  <div style={styles.perkHeader}>
                    <span>🎁</span>
                    <span style={styles.perkType}>Additional Perk</span>
                  </div>
                  <p style={styles.perkText}>{merchant.A_PERK}</p>
                </div>
              )}
              {merchant.B_PERK && (
                <div style={{ ...styles.perk, ...styles.perkBonus }}>
                  <div style={styles.perkHeader}>
                    <span>🎁</span>
                    <span style={styles.perkType}>Bonus Perk</span>
                  </div>
                  <p style={styles.perkText}>{merchant.B_PERK}</p>
                </div>
              )}
              {merchant.D_PERK && merchant.D_PERK !== 'none offered' && (
                <div style={{ ...styles.perk, ...styles.perkDiscount }}>
                  <div style={styles.perkHeader}>
                    <span>💰</span>
                    <span style={styles.perkType}>Discount</span>
                  </div>
                  <p style={styles.perkText}>{merchant.D_PERK}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

const styles = {
  back: { marginBottom: '1rem', padding: '0.5rem 1rem', backgroundColor: 'white', border: '1.5px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', color: '#444', fontWeight: '500' },
  loading: { display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem', color: '#888' },
  spinner: { width: '32px', height: '32px', border: '3px solid #eee', borderTop: '3px solid #1a73e8', borderRadius: '50%', animation: 'spin 0.8s linear infinite', marginBottom: '1rem' },
  hero: { display: 'flex', alignItems: 'center', gap: '1.25rem', backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '1.25rem', borderLeft: '5px solid #5cb85c' },
  heroIcon: { width: '60px', height: '60px', borderRadius: '12px', backgroundColor: '#1a2a4a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: '700', flexShrink: 0 },
  heroName: { margin: '0 0 0.4rem', fontSize: '1.5rem', color: '#1a2a4a' },
  heroAddress: { margin: 0, color: '#666', fontSize: '0.9rem' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: '1.25rem', alignItems: 'start' },
  leftCol: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  rightCol: { display: 'flex', flexDirection: 'column', gap: '1.25rem' },
  card: { backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: '1.25rem' },
  cardTitle: { fontSize: '1rem', color: '#1a2a4a', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #f0f0f0' },
  description: { color: '#444', lineHeight: '1.7', fontSize: '0.95rem', margin: 0 },
  contactGrid: { display: 'flex', flexDirection: 'column', gap: '0.85rem' },
  contactItem: { display: 'flex', alignItems: 'flex-start', gap: '0.75rem' },
  contactIcon: { fontSize: '1.1rem', marginTop: '2px' },
  contactLabel: { fontSize: '0.72rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' },
  contactValue: { fontSize: '0.9rem', color: '#1a73e8', textDecoration: 'none' },
  perks: { display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  perk: { padding: '0.9rem', borderRadius: '8px', border: '1px solid transparent' },
  perkHeader: { display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' },
  perkType: { fontSize: '0.78rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' },
  perkText: { margin: 0, fontSize: '0.88rem', lineHeight: '1.5', color: '#333' },
  perkReward: { backgroundColor: '#e8f5e9', border: '1px solid #c8e6c9' },
  perkExclusive: { backgroundColor: '#fff8e1', border: '1px solid #ffecb3' },
  perkBonus: { backgroundColor: '#e3f2fd', border: '1px solid #bbdefb' },
  perkDiscount: { backgroundColor: '#fce4ec', border: '1px solid #f8bbd0' },
};