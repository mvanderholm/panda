import { useEffect, useState, useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  ActivityIndicator, Image, TextInput, ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { apiFetch, getDivisions } from '../api';
import { useAuth } from '../AuthContext';
import { useBreakpoint } from '../hooks/useBreakpoint';

export default function MerchantsScreen({ navigation }) {
  const { marketId } = useAuth();
  const { isWide, isDesktop } = useBreakpoint();
  const [merchants, setMerchants] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [activeDivision, setActiveDivision] = useState(null);

  // Number of columns for the grid on wide screens
  const numColumns = isDesktop ? 3 : isWide ? 2 : 1;

  useEffect(() => {
    Promise.all([
      apiFetch('MerchantListing', { sMarket: marketId }),
      getDivisions(),
    ])
      .then(([merchantData, divisionData]) => {
        setMerchants(merchantData);
        const usedDivisions = new Set(merchantData.map(m => m.DIVISION_NAME));
        setDivisions((divisionData || []).filter(d => usedDivisions.has(d.DIVISION_NAME)));
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    let result = merchants;
    if (activeDivision) {
      result = result.filter(m => m.DIVISION_NAME === activeDivision);
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter(m =>
        m.NAME?.toLowerCase().includes(q) ||
        m.CONSUMER_SITE_DISPLAY?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [merchants, query, activeDivision]);

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

  const MerchantCard = ({ item }) => (
    <TouchableOpacity
      style={[styles.card, isWide && styles.cardWide]}
      onPress={() => navigation.navigate('MerchantDetail', { merchantId: item.MERCHANT_ID, name: item.NAME })}
    >
      <View style={styles.cardBody}>
        <Ionicons name="chevron-forward" size={18} color="#ccc" style={styles.chevron} />
        <View style={styles.nameRow}>
          <Image
            source={{ uri: `https://www.eport9.com/pinpoint/images/logos/${item.MERCHANT_ID}_7.gif` }}
            style={[styles.logo, isWide && styles.logoWide]}
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

  return (
    <View style={styles.container}>

      {/* Search + filters */}
      <View style={[styles.controls, isWide && styles.controlsWide]}>
        <View style={styles.searchRow}>
          <Ionicons name="search-outline" size={18} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search merchants…"
            value={query}
            onChangeText={setQuery}
            clearButtonMode="while-editing"
            accessibilityLabel="Search merchants"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} accessibilityLabel="Clear search">
              <Ionicons name="close-circle" size={18} color="#aaa" />
            </TouchableOpacity>
          )}
        </View>

        {divisions.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
            <TouchableOpacity
              style={[styles.chip, activeDivision === null && styles.chipActive]}
              onPress={() => setActiveDivision(null)}
              accessibilityRole="radio"
              accessibilityState={{ selected: activeDivision === null }}
              accessibilityLabel="All categories"
            >
              <Text style={[styles.chipText, activeDivision === null && styles.chipTextActive]}>All</Text>
            </TouchableOpacity>
            {divisions.map(d => (
              <TouchableOpacity
                key={d.DIVISION_ID ?? d.DIVISION_NAME}
                style={[styles.chip, activeDivision === d.DIVISION_NAME && styles.chipActive]}
                onPress={() => setActiveDivision(activeDivision === d.DIVISION_NAME ? null : d.DIVISION_NAME)}
                accessibilityRole="radio"
                accessibilityState={{ selected: activeDivision === d.DIVISION_NAME }}
                accessibilityLabel={d.DIVISION_NAME}
              >
                <Text style={[styles.chipText, activeDivision === d.DIVISION_NAME && styles.chipTextActive]}>
                  {d.DIVISION_NAME}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <Text style={styles.subtitle}>
          {filtered.length} {filtered.length === 1 ? 'merchant' : 'merchants'}{activeDivision || query ? ' found' : ' in your area'}
        </Text>
      </View>

      {isWide ? (
        // Wide: grid via ScrollView + flexWrap
        <ScrollView contentContainerStyle={[styles.gridContainer, isWide && styles.gridContainerWide]}>
          <View style={[styles.grid, { gap: 12 }]}>
            {filtered.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No merchants match your search.</Text>
                <TouchableOpacity onPress={() => { setQuery(''); setActiveDivision(null); }}>
                  <Text style={styles.emptyReset}>Clear filters</Text>
                </TouchableOpacity>
              </View>
            ) : (
              filtered.map(item => (
                <View key={item.MERCHANT_ID.toString()} style={{ width: `${100 / numColumns}%`, paddingHorizontal: 4 }}>
                  <MerchantCard item={item} />
                </View>
              ))
            )}
          </View>
        </ScrollView>
      ) : (
        // Narrow: single-column FlatList
        <FlatList
          data={filtered}
          keyExtractor={item => item.MERCHANT_ID.toString()}
          renderItem={({ item }) => <MerchantCard item={item} />}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No merchants match your search.</Text>
              <TouchableOpacity onPress={() => { setQuery(''); setActiveDivision(null); }}>
                <Text style={styles.emptyReset}>Clear filters</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9', paddingTop: 12 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: 'red' },

  controls: { paddingHorizontal: 0 },
  controlsWide: { maxWidth: 1200, alignSelf: 'center', width: '100%' },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 10,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 15, paddingVertical: 10 },

  chipRow: { paddingHorizontal: 16, gap: 8, paddingBottom: 10 },
  chip: { paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, backgroundColor: '#e8edf5' },
  chipActive: { backgroundColor: '#1a73e8' },
  chipText: { fontSize: 13, fontWeight: '600', color: '#555' },
  chipTextActive: { color: '#fff' },

  subtitle: { color: '#666', fontSize: 13, marginBottom: 8, paddingHorizontal: 16 },

  // Grid (wide)
  gridContainer: { paddingBottom: 20, paddingHorizontal: 12 },
  gridContainerWide: { maxWidth: 1200, alignSelf: 'center', width: '100%' },
  grid: { flexDirection: 'row', flexWrap: 'wrap' },

  // Card
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e8e8e8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardWide: {
    marginHorizontal: 0,
    marginBottom: 0,
  },
  cardBody: { padding: 12, position: 'relative' },
  chevron: { position: 'absolute', right: 12, top: '50%' },
  nameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6, gap: 10 },
  logo: { width: 60, height: 60, borderRadius: 6, backgroundColor: '#f4f6f9' },
  logoWide: { width: 72, height: 72 },
  nameDetails: { flex: 1 },
  merchantName: { fontSize: 15, fontWeight: '600', color: '#1a1a1a', marginBottom: 2 },
  division: { fontSize: 12, color: '#888', marginBottom: 2 },
  location: { fontSize: 12, color: '#888' },
  cardMeta: { flexDirection: 'row', gap: 6, marginBottom: 6, flexWrap: 'wrap' },
  doubleBadge: {
    fontSize: 11, fontWeight: '700',
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 4, backgroundColor: '#fff8e1', color: '#f57f17',
  },

  emptyContainer: { alignItems: 'center', paddingTop: 48, width: '100%' },
  emptyText: { fontSize: 15, color: '#888', marginBottom: 12 },
  emptyReset: { fontSize: 14, color: '#1a73e8', fontWeight: '600' },
});
