import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
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

export default function RewardsScreen({ navigation }) {
  const { customerId } = useAuth();
  const [rewards, setRewards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!customerId) return;
    apiFetch('MemberRewards', { CustomerId: customerId, platformtype: 2 })
      .then(data => {
        setRewards(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [customerId]);

  if (loading) return (
    <View style={styles.centered}>
      <ActivityIndicator size="large" color="#1a73e8" />
    </View>
  );

  if (error) return (
    <View style={styles.centered}>
      <Text style={styles.error}>{error}</Text>
    </View>
  );

  const grouped = rewards.reduce((acc, reward) => {
    const key = reward.NAME;
    if (!acc[key]) acc[key] = { name: key, merchantId: reward.MERCHANT_ID, division: reward.DIVISION, rewards: [] };
    acc[key].rewards.push(reward);
    return acc;
  }, {});

  const groups = Object.values(grouped);

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>{rewards.length} rewards available</Text>

      <FlatList
        data={groups}
        keyExtractor={item => item.name}
        renderItem={({ item: group }) => (
          <View style={styles.merchantGroup}>
            <View style={styles.merchantHeader}>
              <Text style={styles.merchantName}>{group.name}</Text>
              <Text style={styles.rewardCount}>{group.rewards.length} reward{group.rewards.length !== 1 ? 's' : ''}</Text>
            </View>
            {group.rewards.map(reward => {
              const colors = CAMPAIGN_COLORS[reward.CAMPAIGNTYPE] || { bg: '#f5f5f5', border: '#e0e0e0', badge: '#555' };
              return (
                <TouchableOpacity key={reward.DETAIL_ID} style={[styles.rewardCard, { backgroundColor: colors.bg, borderColor: colors.border }]} onPress={() => navigation.navigate('RewardDetail', { reward })} activeOpacity={0.75}>
                  <View style={styles.rewardTop}>
                    <Image
                      source={{ uri: `https://www.eport9.com/pinpoint/images/logos/${group.merchantId}_7.gif` }}
                      style={styles.merchantLogo}
                      resizeMode="contain"
                    />
                    <View style={styles.rewardTopRight}>
                      <Text style={[styles.campaignBadge, { backgroundColor: colors.badge }]}>
                        {reward.CAMPAIGNTYPE}
                      </Text>
                      <Text style={[styles.expireDays, { color: daysColor(reward.EXPIREDAYS) }]}>
                        ⏱ {reward.EXPIREDAYS} days
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.offer}>{reward.OFFER}</Text>
                  {reward.DISCLAIMER && (
                    <Text style={styles.disclaimer}>{reward.DISCLAIMER}</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9', padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  subtitle: { color: '#666', fontSize: 14, marginBottom: 10 },
  error: { color: 'red' },
  merchantGroup: { backgroundColor: 'white', borderRadius: 10, marginBottom: 10, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  merchantHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  merchantName: { fontSize: 14, fontWeight: '600', color: '#1a1a1a', flex: 1 },
  rewardCount: { fontSize: 12, color: '#666', backgroundColor: '#f0f0f0', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 },
  rewardCard: { padding: 12, borderWidth: 1, margin: 8, borderRadius: 8 },
  rewardTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 10 },
  merchantLogo: { width: 60, height: 36, borderRadius: 4, backgroundColor: '#fff' },
  rewardTopRight: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  campaignBadge: { fontSize: 10, color: 'white', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, fontWeight: '700' },
  expireDays: { fontSize: 12, fontWeight: '700' },
  offer: { fontSize: 14, fontWeight: '500', color: '#222', marginBottom: 4 },
  disclaimer: { fontSize: 12, color: '#666', fontStyle: 'italic' },
});
