import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity } from 'react-native';

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

export default function RewardDetailScreen({ route, navigation }) {
  const { reward } = route.params;
  const colors = CAMPAIGN_COLORS[reward.CAMPAIGNTYPE] || { bg: '#f5f5f5', border: '#e0e0e0', badge: '#555' };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Merchant */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Merchant</Text>
        <View style={styles.merchantRow}>
          <Image
            source={{ uri: `https://www.eport9.com/pinpoint/images/logos/${reward.MERCHANT_ID}_7.gif` }}
            style={styles.merchantLogo}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.merchantName}>{reward.NAME}</Text>
            {reward.DIVISION && <Text style={styles.division}>{reward.DIVISION}</Text>}
          </View>
        </View>
      </View>

      {/* Hero card */}
      <View style={[styles.heroCard, { backgroundColor: colors.bg, borderColor: colors.border }]}>
        <Text style={[styles.badge, { backgroundColor: colors.badge }]}>{reward.CAMPAIGNTYPE}</Text>
        <Text style={styles.offer}>{reward.OFFER}</Text>
        <Text style={[styles.expiry, { color: daysColor(reward.EXPIREDAYS) }]}>
          Expires in {reward.EXPIREDAYS} days
        </Text>
      </View>

      <TouchableOpacity style={styles.redeemButton} onPress={() => navigation.navigate('RedemptionCode', { reward })} activeOpacity={0.85}>
        <Text style={styles.redeemButtonText}>Tap to Redeem</Text>
      </TouchableOpacity>

      {/* Terms */}
      {reward.DISCLAIMER ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Terms & Conditions</Text>
          <Text style={styles.disclaimer}>{reward.DISCLAIMER}</Text>
        </View>
      ) : null}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  content: { padding: 16, paddingBottom: 40 },
  heroCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  badge: {
    fontSize: 11,
    color: 'white',
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginBottom: 14,
    overflow: 'hidden',
  },
  offer: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 12,
    lineHeight: 30,
  },
  expiry: {
    fontSize: 14,
    fontWeight: '700',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  merchantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  merchantLogo: {
    width: 60,
    height: 40,
    backgroundColor: '#f4f6f9',
    borderRadius: 6,
  },
  merchantName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  division: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  disclaimer: {
    fontSize: 13,
    color: '#555',
    lineHeight: 20,
  },
  redeemButton: {
    backgroundColor: '#1a2a4a',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  redeemButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
});
