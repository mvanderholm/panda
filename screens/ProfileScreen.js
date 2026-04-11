import { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Linking, FlatList } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../AuthContext';
import { apiFetch } from '../api';

const TABS = ['Profile', 'My Points', 'Transactions', 'Contact'];

export default function ProfileScreen() {
  const { customerId } = useAuth();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('Profile');
  const [member, setMember] = useState(null);
  const [points, setPoints] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pointsLoading, setPointsLoading] = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!customerId) return;
    apiFetch('GetMemberProfile', { CustomerId: customerId, platformtype: 2 })
      .then(data => { setMember(data[0]); setLoading(false); })
      .catch(err => { setError(err.message); setLoading(false); });
  }, [customerId]);

  useEffect(() => {
    if (activeTab !== 'My Points' || !customerId || points.length > 0) return;
    setPointsLoading(true);
    apiFetch('PointsAccumulated', { CustomerId: customerId, platformtype: 2 })
      .then(data => { setPoints(data); setPointsLoading(false); })
      .catch(() => setPointsLoading(false));
  }, [activeTab]);

  useEffect(() => {
    if (activeTab !== 'Transactions' || !customerId || transactions.length > 0) return;
    setTxLoading(true);
    apiFetch('RecentTransactions', { CustomerId: customerId, platformtype: 2 })
      .then(data => { console.log('MemberTransations JSON:', JSON.stringify(data[0], null, 2)); setTransactions(data); setTxLoading(false); })
      .catch(() => setTxLoading(false));
  }, [activeTab]);

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => signOut(auth) }
    ]);
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

return (
    <View style={styles.container}>

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
<Text style={styles.name}>{member?.FIRST} {member?.LAST}</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tabItem, activeTab === tab && styles.tabItemActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Tab Content */}
      {activeTab === 'Profile' && (
        <ScrollView style={styles.tabContent}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Phone</Text>
              <Text style={styles.value}>{member?.PHONE2}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Address</Text>
              <Text style={styles.value}>{member?.ADDRESS}{'\n'}{member?.CITY}, {member?.STATE} {member?.ZIP}</Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Gender</Text>
              <Text style={styles.value}>{member?.GENDER_DESC}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Birth Month</Text>
              <Text style={styles.value}>{member?.BIRTH_MONTH_DESC?.trim()}</Text>
            </View>
            {member?.WEDDING_MONTH > 0 && (
              <View style={styles.infoRow}>
                <Text style={styles.label}>Anniversary</Text>
                <Text style={styles.value}>{member?.WEDDING_MONTH_DESC?.trim()}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {activeTab === 'My Points' && (
        <View style={styles.tabContent}>
          {pointsLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color="#1a73e8" />
            </View>
          ) : (
            <FlatList
              data={points}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
              renderItem={({ item }) => (
                <View style={styles.pointsCard}>
                  <View style={styles.pointsRow}>
                    <Text style={styles.pointsMerchant}>{item.NAME}</Text>
                    <Text style={styles.pointsValue}>{item.POINTS_EARNED} / {item.POINTS_NEEDED} pts</Text>
                  </View>
                  <Text style={styles.pointsDivision}>{item.R_PERK}</Text>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${Math.min((item.POINTS_EARNED / item.POINTS_NEEDED) * 100, 100)}%` }]} />
                  </View>
                </View>
              )}
              ListEmptyComponent={<Text style={styles.empty}>No points data available.</Text>}
            />
          )}
        </View>
      )}

      {activeTab === 'Transactions' && (
        <View style={styles.tabContent}>
          {txLoading ? (
            <View style={styles.centered}>
              <ActivityIndicator size="large" color="#1a73e8" />
            </View>
          ) : (
            <FlatList
              data={transactions}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
              renderItem={({ item }) => (
                <View style={styles.txCard}>
                  <View style={styles.pointsRow}>
                    <Text style={styles.txMerchant}>{item.NAME}</Text>
                    <Text style={[styles.txAmount, { color: item.POINTS > 0 ? '#2e7d32' : '#c62828' }]}>
                      {item.POINTS > 0 ? '+' : ''}{item.POINTS} pts
                    </Text>
                  </View>
                  <Text style={styles.txDate}>{item.TRANS_DATE}</Text>
                </View>
              )}
              ListEmptyComponent={<Text style={styles.empty}>No transactions found.</Text>}
            />
          )}
        </View>
      )}

      {activeTab === 'Contact' && (
        <ScrollView style={styles.tabContent} contentContainerStyle={{ padding: 16 }}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Get in Touch</Text>
            <TouchableOpacity onPress={() => Linking.openURL('mailto:info@pinpointrewards.com')}>
              <Text style={styles.contactLink}>info@pinpointrewards.com</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>App Version</Text>
            <Text style={styles.value}>PinPoint 5.0.0</Text>
          </View>
        </ScrollView>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: 'red' },

  header: { backgroundColor: '#ffffff', paddingHorizontal: 28, paddingBottom: 28, paddingTop: 16, alignItems: 'center' },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#1a73e8', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  avatarText: { color: 'white', fontSize: 22, fontWeight: '700' },
  name: { fontSize: 20, fontWeight: '700', color: '#1a2a4a', marginBottom: 2 },
  email: { fontSize: 13, color: 'rgba(255,255,255,0.65)' },

  tabBar: { flexDirection: 'row', backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#eee' },
  tabItem: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: 'transparent' },
  tabItemActive: { borderBottomColor: '#1a73e8' },
  tabText: { fontSize: 11, fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: 0.4 },
  tabTextActive: { color: '#1a73e8' },

  tabContent: { flex: 1 },

  section: { backgroundColor: 'white', padding: 16, marginBottom: 8, marginTop: 8 },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#333', marginBottom: 12, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  infoRow: { flexDirection: 'row', marginBottom: 12 },
  label: { fontSize: 13, color: '#888', width: 110, textTransform: 'uppercase', letterSpacing: 0.5 },
  value: { fontSize: 14, color: '#333', flex: 1 },

  signOutBtn: { margin: 16, padding: 16, backgroundColor: 'white', borderRadius: 10, alignItems: 'center', borderWidth: 1.5, borderColor: '#e53935' },
  signOutText: { color: '#e53935', fontWeight: '600', fontSize: 16 },

  pointsCard: { backgroundColor: 'white', borderRadius: 10, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: '#e8e8e8' },
  pointsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pointsMerchant: { fontSize: 14, fontWeight: '600', color: '#1a1a1a', flex: 1 },
  pointsValue: { fontSize: 15, fontWeight: '700', color: '#8DC63F' },
  pointsDivision: { fontSize: 12, color: '#888', marginTop: 2, marginBottom: 8 },
  progressTrack: { height: 6, backgroundColor: '#e0e0e0', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: 6, backgroundColor: '#8DC63F', borderRadius: 3 },

  txCard: { backgroundColor: 'white', borderRadius: 10, padding: 14, marginBottom: 8, borderWidth: 1, borderColor: '#e8e8e8' },
  txMerchant: { fontSize: 14, fontWeight: '600', color: '#1a1a1a', flex: 1 },
  txAmount: { fontSize: 15, fontWeight: '700' },
  txDate: { fontSize: 12, color: '#888', marginTop: 4 },

  contactLink: { fontSize: 15, color: '#1a73e8', fontWeight: '600', marginBottom: 4 },
  empty: { textAlign: 'center', color: '#888', marginTop: 32, fontSize: 14 },
});
