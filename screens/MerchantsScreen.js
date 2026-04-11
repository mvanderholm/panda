import { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiFetch } from '../api';


export default function MerchantsScreen({ navigation }) {
  const [merchants, setMerchants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch('MerchantListing', { sMarket: 1 })
      .then(data => {
        setMerchants(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

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
    <View style={styles.container}>
      <Text style={styles.subtitle}>{merchants.length} merchants in your area</Text>
      <FlatList
        data={merchants}
        keyExtractor={item => item.MERCHANT_ID.toString()}
        renderItem={({ item }) => {
            return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('MerchantDetail', { merchantId: item.MERCHANT_ID, name: item.NAME })}
            >
              <View style={styles.cardBody}>
                <Ionicons name="chevron-forward" size={18} color="#ccc" style={styles.chevron} />
                <View style={styles.nameRow}>
                  <Image
                    source={{ uri: `https://www.eport9.com/pinpoint/images/logos/${item.MERCHANT_ID}_7.gif` }}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                  <View style={styles.nameDetails}>
                    <Text style={styles.merchantName}>{item.NAME}</Text>
                    <Text style={styles.division}>{item.DIVISION_NAME}</Text>
                    <Text style={styles.location}>{item.CONSUMER_SITE_DISPLAY}</Text>
                  </View>
                </View>
                {item.DOUBLE_POINTS === 1 && (
                  <View style={styles.cardMeta}>
                    <Text style={styles.doubleBadge}>2X Points</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9', padding: 16 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  subtitle: { color: '#666', fontSize: 14, marginBottom: 12 },
  error: { color: 'red' },
  card: { backgroundColor: 'white', borderRadius: 10, marginBottom: 10, overflow: 'hidden', borderWidth: 1, borderColor: '#e8e8e8', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 },
  cardBody: { padding: 12, position: 'relative' },
  chevron: { position: 'absolute', right: 12, top: '50%' },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 10 },
  logo: { width: 60, height: 60, borderRadius: 6, backgroundColor: '#f4f6f9' },
  nameDetails: { flex: 1 },
  merchantName: { fontSize: 15, fontWeight: '600', color: '#1a1a1a', marginBottom: 2 },
  division: { fontSize: 12, color: '#888', marginBottom: 2 },
  cardMeta: { flexDirection: 'row', gap: 6, marginBottom: 6, flexWrap: 'wrap' },
  doubleBadge: { fontSize: 11, fontWeight: '700', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 4, backgroundColor: '#fff8e1', color: '#f57f17' },
  location: { fontSize: 12, color: '#888' },
});