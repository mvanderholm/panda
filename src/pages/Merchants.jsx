import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { apiFetch } from '../api';

const DIVISION_COLORS = {
  'Restaurant': { bg: '#fdecea', color: '#c62828' },
  'Retail': { bg: '#e3f2fd', color: '#1565c0' },
  'Service': { bg: '#e8f5e9', color: '#2e7d32' },
  'Coffee/Smoothies/Quick Serve': { bg: '#fff3e0', color: '#e65100' },
  'Entertainment': { bg: '#f3e5f5', color: '#6a1b9a' },
};

export default function Merchants() {
  const [merchants, setMerchants] = useState([]);
  const [filter, setFilter] = useState('All');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    apiFetch('MerchantListing', { sMarket: 1 })
      .then(setMerchants)
      .catch(err => setError(err.message));
  }, []);

  const divisions = ['All', ...new Set(merchants.map(m => m.DIVISION_NAME))];
  const filtered = filter === 'All' ? merchants : merchants.filter(m => m.DIVISION_NAME === filter);

  return (
    <Layout>
      {/* Page header */}
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Merchants</h1>
          <p style={styles.pageSubtitle}>{merchants.length} participating merchants in your area</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div style={styles.filters}>
        {divisions.map(d => (
          <button
            key={d}
            style={{ ...styles.filterBtn, ...(filter === d ? styles.filterBtnActive : {}) }}
            onClick={() => setFilter(d)}
          >
            {d}
          </button>
        ))}
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Grid */}
      <div style={styles.grid}>
        {filtered.map(m => {
          const dc = DIVISION_COLORS[m.DIVISION_NAME] || { bg: '#f5f5f5', color: '#555' };
          return (
            <div
              key={m.MERCHANT_ID}
              style={styles.card}
              onClick={() => navigate(`/merchants/${m.MERCHANT_ID}`)}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.08)';
              }}
            >
              <div style={{ ...styles.cardAccent, backgroundColor: dc.color }} />
              <div style={styles.cardBody}>
                <h3 style={styles.merchantName}>{m.NAME}</h3>
                <div style={styles.cardMeta}>
                  <span style={{ ...styles.divisionBadge, backgroundColor: dc.bg, color: dc.color }}>
                    {m.DIVISION_NAME}
                  </span>
                  {m.DOUBLE_POINTS === 1 && (
                    <span style={styles.doubleBadge}>⭐ 2X Points</span>
                  )}
                </div>
                <p style={styles.location}>📍 {m.CONSUMER_SITE_DISPLAY}</p>
                <div style={styles.viewMore}>View Details →</div>
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}

const styles = {
  pageHeader: { marginBottom: '1.25rem' },
  pageTitle: { fontSize: '1.75rem', color: '#1a2a4a', marginBottom: '0.25rem' },
  pageSubtitle: { color: '#666', fontSize: '0.95rem' },
  filters: { display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' },
  filterBtn: { padding: '0.4rem 1rem', borderRadius: '20px', border: '1.5px solid #ddd', backgroundColor: 'white', cursor: 'pointer', fontSize: '0.85rem', color: '#555', transition: 'all 0.15s' },
  filterBtnActive: { backgroundColor: '#1a2a4a', color: 'white', border: '1.5px solid #1a2a4a' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1rem' },
  card: { backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', cursor: 'pointer', transition: 'transform 0.15s, box-shadow 0.15s', overflow: 'hidden' },
  cardAccent: { height: '4px' },
  cardBody: { padding: '1.1rem' },
  merchantName: { fontSize: '0.95rem', fontWeight: '600', marginBottom: '0.5rem', color: '#1a2a4a' },
  cardMeta: { display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap' },
  divisionBadge: { fontSize: '0.72rem', fontWeight: '600', padding: '0.2rem 0.6rem', borderRadius: '20px' },
  doubleBadge: { fontSize: '0.72rem', fontWeight: '700', padding: '0.2rem 0.6rem', borderRadius: '20px', backgroundColor: '#fff8e1', color: '#f57f17' },
  location: { fontSize: '0.8rem', color: '#888', margin: '0 0 0.75rem' },
  viewMore: { fontSize: '0.8rem', color: '#1a73e8', fontWeight: '600' },
};