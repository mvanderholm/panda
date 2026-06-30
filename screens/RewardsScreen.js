import { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, FlatList, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Image, RefreshControl } from 'react-native';
import { apiFetch } from '../api';
import { recordError } from '../crashlytics';
import analytics from '../analytics';
import { useAuth } from '../AuthContext';
import { useBreakpoint } from '../hooks/useBreakpoint';
import MerchantFilterChips from '../components/MerchantFilterChips';

const CAMPAIGN_COLORS = {
  'New Merchant Welcome': { bg: '#e8f5e9', border: '#c8e6c9', badge: '#2e7d32' },
  'Welcome Reward':       { bg: '#e3f2fd', border: '#bbdefb', badge: '#1565c0' },
  'Payback Reward':       { bg: '#fff8e1', border: '#ffecb3', badge: '#f57f17' },
  'Birthday Reward':      { bg: '#fce4ec', border: '#f8bbd0', badge: '#880e4f' },
};

function daysColor(days) {
  if (days <= 30) return '#d32f2f';
  if (days <= 90) return '#f57c00';
  return '#2e7d32';
}

export default function RewardsScreen({ navigation }) {
  const { customerId } = useAuth();
  const { isWide, isDesktop } = useBreakpoint();
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [filterMerchant, setFilterMerchant] = useState(null);

  useEffect(() => { analytics.screen('Rewards'); }, []);

  const loadData = useCallback(async () => {
    if (!customerId) return;
    try {
      const data = await apiFetch('MemberRewards', { CustomerId: customerId, platformtype: 2 });
      setRewards(data);
      setError('');
    } catch (err) {
      recordError(err);
      setError(err.message);
    }
  }, [customerId]);

  useEffect(() => {
    loadData().finally(() => setLoading(false));
  }, [loadData]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData().finally(() => setRefreshing(false));
  }, [loadData]);

  if (loading) return (
    <View style={styles.centered}><ActivityIndicator size="large" color="#1a73e8" /></View>
  );

  if (error) return (
    <View style={styles.centered}><Text style={styles.error}>{error}</Text></View>
  );

  const grouped = rewards.reduce((acc, reward) => {
    const key = reward.MERCHANT_ID;
    if (!acc[key]) acc[key] = { name: reward.NAME, merchantId: reward.MERCHANT_ID, division: reward.DIVISION, rewards: [] };
    acc[key].rewards.push(reward);
    return acc;
  }, {});

  const allGroups = Object.values(grouped);
  const merchantChips = useMemo(
    () => allGroups.map(g => ({ id: g.merchantId, name: g.name })).sort((a, b) => a.name.localeCompare(b.name)),
    [rewards]
  );
  const groups = filterMerchant ? allGroups.filter(g => g.merchantId === filterMerchant) : allGroups;
  const numColumns = isDesktop ? 3 : isWide ? 2 : 1;

  if (groups.length === 0) return (
    <View style={styles.centered}>
      <Text style={styles.emptyTitle}>No rewards yet</Text>
      <Text style={styles.emptyBody}>Visit a participating merchant to start earning rewards.</Text>
    </View>
  );

  const RewardCard = ({ reward, merchantId }) => {
    const colors = CAMPAIGN_COLORS[reward.CAMPAIGNTYPE] || { bg: '#f5f5f5', border: '#e0e0e0', badge: '#555' };
    return (
      <TouchableOpacity
        style={[styles.rewardCard, { backgroundColor: colors.bg, borderColor: colors.border }]}
        onPress={() => navigation.navigate('RewardDetail', { reward })}
        activeOpacity={0.75}
      >
        <View style={styles.rewardTop}>
          <Image
            source={{ uri: `https://www.eport9.com/pinpoint/images/logos/${merchantId}_7.gif` }}
            style={styles.merchantLogo}
            resizeMode="contain"
          />
          <View style={styles.rewardTopRight}>
            <Text style={[styles.campaignBadge, { backgroundColor: colors.badge }]}>
              {reward.CAMPAIGNTYPE}
            </Text>
            <Text style={[styles.expireDays, { color: daysColor(reward.EXPIREDAYS) }]}>
              {reward.EXPIREDAYS <= 0 ? 'Expired' : `⏱ ${reward.EXPIREDAYS} days`}
            </Text>
          </View>
        </View>
        <Text style={styles.offer}>{reward.OFFER}</Text>
        {reward.DISCLAIMER && <Text style={styles.disclaimer}>{reward.DISCLAIMER}</Text>}
      </TouchableOpacity>
    );
  };

  const MerchantGroup = ({ group }) => (
    <View style={[styles.merchantGroup, isWide && styles.merchantGroupWide]}>
      <View style={styles.merchantHeader}>
        <Text style={styles.merchantName}>{group.name}</Text>
        <Text style={styles.rewardCount}>
          {group.rewards.length} reward{group.rewards.length !== 1 ? 's' : ''}
        </Text>
      </View>
      {isWide ? (
        <View style={styles.rewardGrid}>
          {group.rewards.map(reward => (
            <View key={reward.DETAIL_ID} style={{ flex: 1, minWidth: 220 }}>
              <RewardCard reward={reward} merchantId={group.merchantId} />
            </View>
          ))}
        </View>
      ) : (
        group.rewards.map(reward => (
          <RewardCard key={reward.DETAIL_ID} reward={reward} merchantId={group.merchantId} />
        ))
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.subtitle, isWide && styles.subtitleWide]}>
        {groups.reduce((n, g) => n + g.rewards.length, 0)} reward{groups.reduce((n, g) => n + g.rewards.length, 0) !== 1 ? 's' : ''} available
      </Text>

      <MerchantFilterChips merchants={merchantChips} selected={filterMerchant} onChange={setFilterMerchant} />

      {isWide ? (
        <ScrollView
          contentContainerStyle={[styles.gridOuter, isWide && styles.gridOuterWide, { paddingHorizontal: 16 }]}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View style={[styles.groupGrid, { gap: 16 }]}>
            {groups.map(group => (
              <View key={group.name} style={{ width: `${100 / numColumns}%`, paddingHorizontal: 4 }}>
                <MerchantGroup group={group} />
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={groups}
          keyExtractor={item => String(item.merchantId)}
          renderItem={({ item }) => <MerchantGroup group={item} />}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: 'red' },

  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#1a2a4a', marginBottom: 8 },
  emptyBody: { fontSize: 14, color: '#888', textAlign: 'center', paddingHorizontal: 32, lineHeight: 22 },
  subtitle: { color: '#666', fontSize: 14, paddingHorizontal: 16, paddingTop: 12 },
  subtitleWide: { maxWidth: 1200, alignSelf: 'center', width: '100%' },

  gridOuter: { paddingBottom: 20 },
  gridOuterWide: { maxWidth: 1200, alignSelf: 'center', width: '100%' },
  groupGrid: { flexDirection: 'row', flexWrap: 'wrap' },

  merchantGroup: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  merchantGroupWide: { marginBottom: 0 },
  merchantHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  merchantName: { fontSize: 14, fontWeight: '600', color: '#1a1a1a', flex: 1 },
  rewardCount: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },

  rewardGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, padding: 8 },

  rewardCard: {
    padding: 12,
    borderWidth: 1,
    margin: 8,
    borderRadius: 8,
  },
  rewardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 10 },
  merchantLogo: { width: 60, height: 36, borderRadius: 4, backgroundColor: '#fff' },
  rewardTopRight: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  campaignBadge: {
    fontSize: 10,
    color: 'white',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    fontWeight: '700',
  },
  expireDays: { fontSize: 12, fontWeight: '700' },
  offer: { fontSize: 14, fontWeight: '500', color: '#222', marginBottom: 4 },
  disclaimer: { fontSize: 12, color: '#666', fontStyle: 'italic' },
});
