import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { apiFetch } from '../api';
import { useAuth } from '../AuthContext';

const CAMPAIGN_COLORS = {
  'New Merchant Welcome': { bg: '#e8f5e9', border: '#c8e6c9', badge: '#2e7d32' },
  'Welcome Reward': { bg: '#e3f2fd', border: '#bbdefb', badge: '#1565c0' },
  'Payback Reward': { bg: '#fff8e1', border: '#ffecb3', badge: '#f57f17' },
  'Birthday Reward': { bg: '#fce4ec', border: '#f8bbd0', badge: '#880e4f' },
};

function daysColor(days) {
  if (days <= 30) return '#d32f2f';
  if (days <= 90) return '#f57c00';
  return '#2e7d32';
}

export default function Rewards() {
  const { customerId } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    if (!customerId) return;
    apiFetch('MemberRewards', { CustomerId: customerId, platformtype: 2 })
      .then(setRewards)
      .catch(err => setError(err.message));
  }, [customerId]);

  // Group by merchant
  const grouped = rewards.reduce((acc, reward) => {
    const key = reward.NAME;
    if (!acc[key]) acc[key] = { name: key, division: reward.DIVISION, merchant_id: reward.MERCHANT_ID, rewards: [] };
    acc[key].rewards.push(reward);
    return acc;
  }, {});

  const campaignTypes = ['All', ...new Set(rewards.map(r => r.CAMPAIGNTYPE))];
  const filteredGroups = Object.values(grouped).map(group => ({
    ...group,
    rewards: filter === 'All' ? group.rewards : group.rewards.filter(r => r.CAMPAIGNTYPE === filter)
  })).filter(group => group.rewards.length > 0);

  const totalRewards = rewards.length;

  return (
    <Layout>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>My Rewards</h1>
            <p style={styles.subtitle}>{totalRewards} reward{totalRewards !== 1 ? 's' : ''} available</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div style={styles.filters}>
          {campaignTypes.map(type => (
            <button
              key={type}
              style={{ ...styles.filterBtn, ...(filter === type ? styles.filterBtnActive : {}) }}
              onClick={() => setFilter(type)}
            >
              {type}
            </button>
          ))}
        </div>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* Grouped by merchant */}
        {filteredGroups.map(group => (
          <div key={group.name} style={styles.merchantGroup}>
            <div style={styles.merchantHeader}>
              <div>
                <h2 style={styles.merchantName}>{group.name}</h2>
                <span style={styles.division}>{group.division}</span>
              </div>
              <span style={styles.rewardCount}>{group.rewards.length} reward{group.rewards.length !== 1 ? 's' : ''}</span>
            </div>

            <div style={styles.rewardsList}>
              {group.rewards.map(reward => {
                const colors = CAMPAIGN_COLORS[reward.CAMPAIGNTYPE] || { bg: '#f5f5f5', border: '#e0e0e0', badge: '#555' };
                return (
                  <div key={reward.DETAIL_ID} style={{ ...styles.rewardCard, backgroundColor: colors.bg, border: `1px solid ${colors.border}` }}>
                    <div style={styles.rewardTop}>
                      <span style={{ ...styles.campaignBadge, backgroundColor: colors.badge }}>
                        {reward.CAMPAIGNTYPE}
                      </span>
                      <span style={{ ...styles.expireDays, color: daysColor(reward.EXPIREDAYS) }}>
                        ⏱ {reward.EXPIREDAYS} days left
                      </span>
                    </div>
                    <p style={styles.offer}>{reward.OFFER}</p>
                    {reward.DISCLAIMER && (
                      <p style={styles.disclaimer}>{reward.DISCLAIMER}</p>
                    )}
                    <p style={styles.expireDate}>Expires: {reward.PROMOEXPIRE.split(' ')[0]} {reward.PROMOEXPIRE.split(' ')[1]} {reward.PROMOEXPIRE.split(' ')[2]}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

      </div>
    </Layout>
  );
}

const styles = {
  container: { maxWidth: '900px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' },
  title: { fontSize: '1.75rem', color: '#1a2a4a', marginBottom: '0.25rem' },
  subtitle: { margin: '0 0 1.25rem', color: '#666', fontSize: '0.95rem' },
  filters: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  filterBtn: { padding: '0.4rem 1rem', borderRadius: '20px', border: '1.5px solid #ddd', backgroundColor: 'white', cursor: 'pointer', fontSize: '0.85rem', color: '#555' },
  filterBtnActive: { backgroundColor: '#1a2a4a', color: 'white', border: '1.5px solid #1a2a4a' },
  merchantGroup: { backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '1rem', overflow: 'hidden', borderLeft: '4px solid #5cb85c' },
  merchantHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem', borderBottom: '1px solid #f0f0f0', backgroundColor: '#fafafa' },
  merchantName: { margin: '0 0 0.2rem', fontSize: '1rem', color: '#1a2a4a' },
  division: { fontSize: '0.78rem', color: '#888' },
  rewardCount: { fontSize: '0.82rem', color: '#5cb85c', backgroundColor: '#e8f5e9', padding: '0.25rem 0.75rem', borderRadius: '20px', fontWeight: '600' },
  rewardsList: { padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  rewardCard: { padding: '1rem', borderRadius: '8px' },
  rewardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' },
  campaignBadge: { fontSize: '0.7rem', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '20px', fontWeight: '700' },
  expireDays: { fontSize: '0.8rem', fontWeight: '700' },
  offer: { margin: '0 0 0.4rem', fontSize: '0.95rem', fontWeight: '600', color: '#1a2a4a' },
  disclaimer: { margin: '0 0 0.4rem', fontSize: '0.8rem', color: '#666', fontStyle: 'italic' },
  expireDate: { margin: 0, fontSize: '0.75rem', color: '#aaa' },
};