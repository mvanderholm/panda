import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Image, TouchableOpacity, Linking, Platform } from 'react-native';
import { apiFetch } from '../api';

export default function MerchantDetailScreen({ route }) {
  const { merchantId, name } = route.params;
  const [merchant, setMerchant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [aboutExpanded, setAboutExpanded] = useState(false);

  useEffect(() => {
    apiFetch('MerchantDetail', { MerchantId: merchantId, platformtype: 2 })
      .then(data => {
        setMerchant(data[0]);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [merchantId]);

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

  return (
    <ScrollView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: `https://www.eport9.com/pinpoint/images/logos/${merchantId}_7.gif` }}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.name}>{merchant.NAME}</Text>
        <Text style={styles.address}>
          {merchant.ADDRESS}, {merchant.CITY}, {merchant.STATE} {merchant.ZIP?.trim()}
        </Text>
        <TouchableOpacity
          style={styles.mapLink}
          onPress={() => {
            const addr = encodeURIComponent(`${merchant.ADDRESS}, ${merchant.CITY}, ${merchant.STATE} ${merchant.ZIP?.trim()}`);
            const url = Platform.OS === 'ios'
              ? `maps://0,0?q=${addr}`
              : `geo:0,0?q=${addr}`;
            Linking.openURL(url).catch(() =>
              Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${addr}`)
            );
          }}
        >
          <Text style={styles.mapLinkText}>View on Map</Text>
        </TouchableOpacity>
      </View>


      {/* About */}
      {merchant.MERCHANT_DESCRIPTION && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text
            style={styles.description}
            numberOfLines={aboutExpanded ? undefined : 3}
          >
            {merchant.MERCHANT_DESCRIPTION.replace(/[\r\n]+/g, ' ').trim()}
          </Text>
          <TouchableOpacity onPress={() => setAboutExpanded(!aboutExpanded)}>
            <Text style={styles.expandToggle}>{aboutExpanded ? 'Show less' : 'Show more'}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Perks */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Perks & Rewards</Text>
        {merchant.E_PERK && merchant.E_PERK !== 'none offered' && (
          <View style={[styles.perkCard, styles.exclusiveCard]}>
            <Text style={styles.perkLabel}>Welcome Reward</Text>
            <Text style={styles.perkText}>{merchant.E_PERK}</Text>
          </View>
        )}
        {merchant.R_PERK && (
          <View style={[styles.perkCard, styles.rewardCard]}>
            <Text style={styles.perkLabel}>Payback Reward</Text>
            <Text style={styles.perkText}>{merchant.R_PERK}</Text>
          </View>
        )}
        {merchant.D_PERK && merchant.D_PERK !== 'none offered' && (
          <View style={styles.perkCard}>
            <Text style={styles.perkLabel}>Discount</Text>
            <Text style={styles.perkText}>{merchant.D_PERK}</Text>
          </View>
        )}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: 'red' },
  header: { backgroundColor: 'white', padding: 16, marginBottom: 8 },
  logo: { width: 200, height: 100, borderRadius: 8, backgroundColor: '#f4f6f9', marginBottom: 12, alignSelf: 'center' },
  name: { fontSize: 20, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },
  address: { fontSize: 14, color: '#666', marginBottom: 8 },
  mapLink: { alignSelf: 'flex-start' },
  mapLinkText: { fontSize: 13, color: '#1a73e8', fontWeight: '600' },
  section: { backgroundColor: 'white', padding: 16, marginBottom: 8 },
  sectionTitle: { fontSize: 15, fontWeight: '600', marginBottom: 12, color: '#333', borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 8 },
  link: { fontSize: 15, color: '#1a73e8', marginBottom: 8 },
  description: { fontSize: 14, color: '#444', lineHeight: 22 },
  expandToggle: { fontSize: 13, color: '#1a73e8', marginTop: 6 },
  perkCard: { padding: 12, borderRadius: 8, backgroundColor: '#e8f5e9', borderWidth: 1, borderColor: '#c8e6c9', marginBottom: 8 },
  rewardCard: {},
  exclusiveCard: {},
  perkLabel: { fontSize: 12, fontWeight: '700', color: '#555', marginBottom: 4 },
  perkText: { fontSize: 14, color: '#333', lineHeight: 20 },
});