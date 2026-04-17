import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Image, TouchableOpacity, Linking, Platform } from 'react-native';
import { apiFetch } from '../api';
import { useBreakpoint } from '../hooks/useBreakpoint';

export default function MerchantDetailScreen({ route }) {
  const { merchantId } = route.params;
  const { isWide } = useBreakpoint();
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

  const openMap = () => {
    const addr = encodeURIComponent(
      `${merchant.ADDRESS}, ${merchant.CITY}, ${merchant.STATE} ${merchant.ZIP?.trim()}`
    );
    if (Platform.OS === 'web') {
      Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${addr}`);
    } else if (Platform.OS === 'ios') {
      Linking.openURL(`maps://0,0?q=${addr}`).catch(() =>
        Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${addr}`)
      );
    } else {
      Linking.openURL(`geo:0,0?q=${addr}`).catch(() =>
        Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${addr}`)
      );
    }
  };

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

  const perks = [
    merchant.E_PERK && merchant.E_PERK !== 'none offered'
      ? { label: 'Welcome Reward', text: merchant.E_PERK, style: styles.perkCardWelcome }
      : null,
    merchant.R_PERK
      ? { label: 'Payback Reward', text: merchant.R_PERK, style: styles.perkCardPayback }
      : null,
    merchant.D_PERK && merchant.D_PERK !== 'none offered'
      ? { label: 'Discount', text: merchant.D_PERK, style: styles.perkCard }
      : null,
  ].filter(Boolean);

  return (
    <ScrollView style={styles.container} contentContainerStyle={[styles.content, isWide && styles.contentWide]}>

      {isWide ? (
        // Wide: header left, perks right
        <View style={styles.twoCol}>
          <View style={styles.colLeft}>
            <View style={styles.headerCard}>
              <Image
                source={{ uri: `https://www.eport9.com/pinpoint/images/logos/${merchantId}_7.gif` }}
                style={styles.logo}
                resizeMode="contain"
              />
              <Text style={styles.merchantName}>{merchant.NAME}</Text>
              <Text style={styles.address}>
                {merchant.ADDRESS}, {merchant.CITY}, {merchant.STATE} {merchant.ZIP?.trim()}
              </Text>
              <TouchableOpacity style={styles.mapLink} onPress={openMap}>
                <Text style={styles.mapLinkText}>View on Map ↗</Text>
              </TouchableOpacity>
            </View>

            {merchant.MERCHANT_DESCRIPTION && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>About</Text>
                <Text
                  style={styles.description}
                  numberOfLines={aboutExpanded ? undefined : 5}
                >
                  {merchant.MERCHANT_DESCRIPTION.replace(/[\r\n]+/g, ' ').trim()}
                </Text>
                <TouchableOpacity onPress={() => setAboutExpanded(!aboutExpanded)}>
                  <Text style={styles.expandToggle}>{aboutExpanded ? 'Show less' : 'Show more'}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          <View style={styles.colRight}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Perks & Rewards</Text>
              {perks.map(p => (
                <View key={p.label} style={[styles.perkCard, p.style]}>
                  <Text style={styles.perkLabel}>{p.label}</Text>
                  <Text style={styles.perkText}>{p.text}</Text>
                </View>
              ))}
              {perks.length === 0 && <Text style={styles.noPerks}>No perks available.</Text>}
            </View>
          </View>
        </View>
      ) : (
        // Narrow: stacked
        <>
          <View style={styles.header}>
            <Image
              source={{ uri: `https://www.eport9.com/pinpoint/images/logos/${merchantId}_7.gif` }}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.merchantName}>{merchant.NAME}</Text>
            <Text style={styles.address}>
              {merchant.ADDRESS}, {merchant.CITY}, {merchant.STATE} {merchant.ZIP?.trim()}
            </Text>
            <TouchableOpacity style={styles.mapLink} onPress={openMap}>
              <Text style={styles.mapLinkText}>View on Map</Text>
            </TouchableOpacity>
          </View>

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

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Perks & Rewards</Text>
            {perks.map(p => (
              <View key={p.label} style={[styles.perkCard, p.style]}>
                <Text style={styles.perkLabel}>{p.label}</Text>
                <Text style={styles.perkText}>{p.text}</Text>
              </View>
            ))}
          </View>
        </>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: 'red' },

  content: { paddingBottom: 32 },
  contentWide: { maxWidth: 1100, alignSelf: 'center', width: '100%', padding: 24 },

  // Two-column layout (wide)
  twoCol: { flexDirection: 'row', gap: 20, alignItems: 'flex-start' },
  colLeft: { flex: 1 },
  colRight: { flex: 1 },

  headerCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },

  // Narrow header
  header: { backgroundColor: 'white', padding: 16, marginBottom: 8 },

  logo: { width: 200, height: 100, borderRadius: 8, backgroundColor: '#f4f6f9', marginBottom: 12, alignSelf: 'center' },
  merchantName: { fontSize: 20, fontWeight: '700', color: '#1a1a1a', marginBottom: 4 },
  address: { fontSize: 14, color: '#666', marginBottom: 8 },
  mapLink: { alignSelf: 'flex-start' },
  mapLinkText: { fontSize: 13, color: '#1a73e8', fontWeight: '600' },

  section: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  description: { fontSize: 14, color: '#444', lineHeight: 22 },
  expandToggle: { fontSize: 13, color: '#1a73e8', marginTop: 6 },

  perkCard: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#e8f5e9',
    borderWidth: 1,
    borderColor: '#c8e6c9',
    marginBottom: 8,
  },
  perkCardWelcome: { backgroundColor: '#e3f2fd', borderColor: '#bbdefb' },
  perkCardPayback: { backgroundColor: '#fff8e1', borderColor: '#ffecb3' },
  perkLabel: { fontSize: 12, fontWeight: '700', color: '#555', marginBottom: 4 },
  perkText: { fontSize: 14, color: '#333', lineHeight: 20 },
  noPerks: { fontSize: 14, color: '#888' },
});
