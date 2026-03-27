import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { apiFetch } from '../api';
import { useAuth } from '../AuthContext';

export default function Profile() {
  const { customerId } = useAuth();
  const [member, setMember] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!customerId) return;
    apiFetch('GetMemberProfile', { CustomerId: customerId, platformtype: 2 })
      .then(data => setMember(data[0]))
      .catch(err => setError(err.message));
  }, [customerId]);

  if (error) return <Layout><p style={{ color: 'red' }}>{error}</p></Layout>;
  if (!member) return <Layout><p style={{ padding: '2rem', color: '#888' }}>Loading profile...</p></Layout>;

  return (
    <Layout>
      <div style={styles.container}>

        {/* Hero card */}
        <div style={styles.hero}>
          <div style={styles.avatar}>
            {member.FIRST?.charAt(0)}{member.LAST?.charAt(0)}
          </div>
          <div style={styles.heroInfo}>
            <h1 style={styles.heroName}>{member.FIRST} {member.MIDDLE} {member.LAST}</h1>
            <p style={styles.heroEmail}>{member.E_MAIL}</p>
            <span style={styles.memberBadge}>⭐ PinPoint Member</span>
          </div>
        </div>

        <div style={styles.grid}>
          {/* Contact */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>📞 Contact Information</h2>
            <div style={styles.infoList}>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Phone</span>
                <span style={styles.infoValue}>{member.PHONE2}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Email</span>
                <span style={styles.infoValue}>{member.E_MAIL}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Address</span>
                <span style={styles.infoValue}>
                  {member.ADDRESS}{member.ADDRESS2 ? `, ${member.ADDRESS2}` : ''}, {member.CITY}, {member.STATE} {member.ZIP}
                </span>
              </div>
            </div>
          </div>

          {/* Personal */}
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>👤 Personal Information</h2>
            <div style={styles.infoList}>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Gender</span>
                <span style={styles.infoValue}>{member.GENDER_DESC}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Birth Month</span>
                <span style={styles.infoValue}>{member.BIRTH_MONTH_DESC?.trim()}</span>
              </div>
              {member.WEDDING_MONTH > 0 && (
                <div style={styles.infoRow}>
                  <span style={styles.infoLabel}>Anniversary Month</span>
                  <span style={styles.infoValue}>{member.WEDDING_MONTH_DESC?.trim()}</span>
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
  container: { maxWidth: '900px' },
  hero: { display: 'flex', alignItems: 'center', gap: '1.5rem', backgroundColor: 'white', padding: '1.75rem', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '1.25rem', borderLeft: '5px solid #5cb85c' },
  avatar: { width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #1a2a4a, #1a73e8)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', fontWeight: '700', flexShrink: 0 },
  heroInfo: { display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  heroName: { margin: 0, fontSize: '1.5rem', color: '#1a2a4a' },
  heroEmail: { margin: 0, color: '#666', fontSize: '0.9rem' },
  memberBadge: { display: 'inline-block', backgroundColor: '#fff8e1', color: '#f57f17', fontSize: '0.78rem', fontWeight: '700', padding: '0.2rem 0.6rem', borderRadius: '20px', width: 'fit-content' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' },
  card: { backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', padding: '1.25rem' },
  cardTitle: { fontSize: '1rem', color: '#1a2a4a', marginBottom: '1rem', paddingBottom: '0.5rem', borderBottom: '2px solid #f0f0f0' },
  infoList: { display: 'flex', flexDirection: 'column', gap: '0.85rem' },
  infoRow: { display: 'flex', flexDirection: 'column', gap: '0.2rem' },
  infoLabel: { fontSize: '0.72rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' },
  infoValue: { fontSize: '0.95rem', color: '#333' },
};