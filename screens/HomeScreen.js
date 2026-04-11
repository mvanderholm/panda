import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../AuthContext';
import { apiFetch } from '../api';

const NAV_ITEMS = [
  { label: 'Merchants',   icon: 'storefront-outline', screen: 'Merchants'  },
  { label: 'My Card',     icon: 'barcode-outline',    screen: 'My Card'    },
  { label: 'My Rewards',  icon: 'gift-outline',       screen: 'My Rewards' },
  { label: 'Profile',     icon: 'person-outline',     screen: 'Profile'    },
];

export default function HomeScreen({ navigation }) {
  const { user, customerId } = useAuth();
  const insets = useSafeAreaInsets();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!customerId) return;
    apiFetch('GetMemberProfile', { CustomerId: customerId, platformtype: 2 })
      .then(data => {
        setMember(data[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [customerId]);

  const firstName = member?.FIRST || user?.email?.split('@')[0] || 'Member';

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        <View style={styles.divider} />
        <Text style={styles.greeting}>Welcome back,</Text>
        {loading
          ? <ActivityIndicator color="#1a2a4a" style={{ marginTop: 4 }} />
          : <Text style={styles.name}>{firstName}</Text>
        }
      </View>

      {/* Quick access list */}
      <Text style={styles.sectionTitle}>Quick Access</Text>
      <View style={styles.list}>
        {NAV_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={item.screen}
            style={[styles.row, index === NAV_ITEMS.length - 1 && styles.rowLast]}
            onPress={() => navigation.navigate(item.screen)}
            activeOpacity={0.7}
          >
            <View style={styles.iconWrap}>
              <Ionicons name={item.icon} size={22} color="#1a73e8" />
            </View>
            <Text style={styles.rowLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  content: { paddingBottom: 32 },

  header: {
    backgroundColor: '#ffffff',
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  logo: {
    width: 180,
    height: 64,
    marginBottom: 16,
  },
  divider: {
    width: '100%',
    height: 2,
    backgroundColor: '#1a2a4a',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 15,
    color: '#555',
    marginBottom: 4,
  },
  name: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a2a4a',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#888',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 28,
    marginBottom: 12,
    marginHorizontal: 20,
  },

  list: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#eef4fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  rowLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#1a1a1a',
  },
});
