import { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, ActivityIndicator,
  TouchableOpacity, Alert, Linking, FlatList, TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Constants from 'expo-constants';
import { useAuth } from '../AuthContext';
import { apiFetch, updateProfile } from '../api';

const TABS = ['Profile', 'My Points', 'Transactions', 'Contact'];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const GENDERS = [
  { label: 'Male', value: 1 },
  { label: 'Female', value: 2 },
  { label: 'Prefer not to say', value: 0 },
];

export default function ProfileScreen({ navigation }) {
  const { customerId, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('Profile');
  const [member, setMember] = useState(null);
  const [points, setPoints] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pointsLoading, setPointsLoading] = useState(false);
  const [txLoading, setTxLoading] = useState(false);
  const [error, setError] = useState('');

  // Edit mode state
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editFirst, setEditFirst] = useState('');
  const [editLast, setEditLast] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editCity, setEditCity] = useState('');
  const [editState, setEditState] = useState('');
  const [editZip, setEditZip] = useState('');
  const [editBirthMonth, setEditBirthMonth] = useState(0);
  const [editGender, setEditGender] = useState(0);

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
      .then(data => { setTransactions(data); setTxLoading(false); })
      .catch(() => setTxLoading(false));
  }, [activeTab]);

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  const startEditing = () => {
    setEditFirst(member?.FIRST || '');
    setEditLast(member?.LAST || '');
    setEditPhone(member?.PHONE2 || '');
    setEditAddress(member?.ADDRESS || '');
    setEditCity(member?.CITY || '');
    setEditState(member?.STATE || '');
    setEditZip(member?.ZIP?.trim() || '');
    setEditBirthMonth(member?.BD1_MONTH ?? 0);
    setEditGender(member?.GENDER ?? 0);
    setEditing(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile(customerId, {
        firstname: editFirst.trim(),
        lastname: editLast.trim(),
        Cell_Phone: editPhone.trim(),
        address: editAddress.trim(),
        city: editCity.trim(),
        state: editState.trim(),
        zip: editZip.trim(),
        birth_month: editBirthMonth,
        Gender: editGender,
      });
      // Refresh member data
      const data = await apiFetch('GetMemberProfile', { CustomerId: customerId, platformtype: 2 });
      setMember(data[0]);
      setEditing(false);
    } catch (err) {
      Alert.alert('Save failed', err.message || 'Please try again.');
    } finally {
      setSaving(false);
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

  const appVersion = Constants.expoConfig?.version ?? '—';

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
            onPress={() => { setActiveTab(tab); setEditing(false); }}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Profile tab */}
      {activeTab === 'Profile' && (
        <ScrollView style={styles.tabContent}>
          {editing ? (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Name</Text>
                <TextInput style={styles.input} value={editFirst} onChangeText={setEditFirst} placeholder="First name" accessibilityLabel="First name" />
                <TextInput style={styles.input} value={editLast} onChangeText={setEditLast} placeholder="Last name" accessibilityLabel="Last name" />
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Contact</Text>
                <TextInput style={styles.input} value={editPhone} onChangeText={setEditPhone} placeholder="Phone" keyboardType="phone-pad" accessibilityLabel="Phone number" />
                <TextInput style={styles.input} value={editAddress} onChangeText={setEditAddress} placeholder="Address" accessibilityLabel="Address" />
                <TextInput style={styles.input} value={editCity} onChangeText={setEditCity} placeholder="City" accessibilityLabel="City" />
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TextInput style={[styles.input, { width: 70 }]} value={editState} onChangeText={setEditState} placeholder="ST" autoCapitalize="characters" maxLength={2} accessibilityLabel="State" />
                  <TextInput style={[styles.input, { flex: 1 }]} value={editZip} onChangeText={setEditZip} placeholder="ZIP" keyboardType="number-pad" accessibilityLabel="ZIP code" />
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Birth Month (optional)</Text>
                <View style={styles.chipGrid}>
                  {MONTHS.map((m, i) => (
                    <TouchableOpacity
                      key={m}
                      style={[styles.chip, editBirthMonth === i + 1 && styles.chipActive]}
                      onPress={() => setEditBirthMonth(editBirthMonth === i + 1 ? 0 : i + 1)}
                    >
                      <Text style={[styles.chipText, editBirthMonth === i + 1 && styles.chipTextActive]}>{m.slice(0, 3)}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Gender (optional)</Text>
                <View style={styles.chipRow}>
                  {GENDERS.map(g => (
                    <TouchableOpacity
                      key={g.value}
                      style={[styles.chip, editGender === g.value && styles.chipActive]}
                      onPress={() => setEditGender(g.value)}
                    >
                      <Text style={[styles.chipText, editGender === g.value && styles.chipTextActive]}>{g.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 10, margin: 16 }}>
                <TouchableOpacity style={[styles.actionBtn, styles.cancelBtn]} onPress={() => setEditing(false)}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, styles.saveBtn, saving && { opacity: 0.6 }]} onPress={handleSave} disabled={saving}>
                  {saving ? <ActivityIndicator color="white" /> : <Text style={styles.saveBtnText}>Save Changes</Text>}
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
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
              <TouchableOpacity style={styles.editBtn} onPress={startEditing}>
                <Text style={styles.editBtnText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
                <Text style={styles.signOutText}>Sign Out</Text>
              </TouchableOpacity>
            </>
          )}
        </ScrollView>
      )}

      {/* My Points tab */}
      {activeTab === 'My Points' && (
        <View style={styles.tabContent}>
          {pointsLoading ? (
            <View style={styles.centered}><ActivityIndicator size="large" color="#1a73e8" /></View>
          ) : (
            <FlatList
              data={points}
              keyExtractor={(_, index) => index.toString()}
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

      {/* Transactions tab */}
      {activeTab === 'Transactions' && (
        <View style={styles.tabContent}>
          {txLoading ? (
            <View style={styles.centered}><ActivityIndicator size="large" color="#1a73e8" /></View>
          ) : (
            <FlatList
              data={transactions}
              keyExtractor={(_, index) => index.toString()}
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

      {/* Contact tab */}
      {activeTab === 'Contact' && (
        <ScrollView style={styles.tabContent} contentContainerStyle={{ padding: 16 }}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Get in Touch</Text>
            <TouchableOpacity onPress={() => Linking.openURL('mailto:info@pinpointrewards.com')}>
              <Text style={styles.contactLink}>info@pinpointrewards.com</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Legal</Text>
            <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
              <Text style={styles.contactLink}>Privacy Policy</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>App Version</Text>
            <Text style={styles.value}>PinPoint {appVersion}</Text>
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
  name: { fontSize: 20, fontWeight: '700', color: '#1a2a4a', marginBottom: 2 },

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

  input: {
    borderWidth: 1.5, borderColor: '#e0e0e0', borderRadius: 8,
    padding: 11, marginBottom: 10, fontSize: 15, backgroundColor: '#fff',
  },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingVertical: 7, paddingHorizontal: 14, borderRadius: 20, backgroundColor: '#e8edf5' },
  chipActive: { backgroundColor: '#1a73e8' },
  chipText: { fontSize: 13, fontWeight: '600', color: '#555' },
  chipTextActive: { color: '#fff' },

  editBtn: { margin: 16, padding: 14, backgroundColor: 'white', borderRadius: 10, alignItems: 'center', borderWidth: 1.5, borderColor: '#1a73e8' },
  editBtnText: { color: '#1a73e8', fontWeight: '600', fontSize: 16 },
  signOutBtn: { marginHorizontal: 16, marginBottom: 16, padding: 16, backgroundColor: 'white', borderRadius: 10, alignItems: 'center', borderWidth: 1.5, borderColor: '#e53935' },
  signOutText: { color: '#e53935', fontWeight: '600', fontSize: 16 },

  actionBtn: { flex: 1, padding: 14, borderRadius: 10, alignItems: 'center' },
  cancelBtn: { backgroundColor: 'white', borderWidth: 1.5, borderColor: '#ccc' },
  cancelBtnText: { color: '#555', fontWeight: '600', fontSize: 15 },
  saveBtn: { backgroundColor: '#1a73e8' },
  saveBtnText: { color: 'white', fontWeight: '600', fontSize: 15 },

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
