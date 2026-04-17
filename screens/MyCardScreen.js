import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import BarcodeDisplay from '../components/BarcodeDisplay';
import { useAuth } from '../AuthContext';
import { getMemberProfile } from '../api';
import { useBreakpoint } from '../hooks/useBreakpoint';

export default function MyCardScreen() {
  const { customerId } = useAuth();
  const insets = useSafeAreaInsets();
  const { isWide } = useBreakpoint();
  const [cardNumber, setCardNumber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState('barcode');

  useEffect(() => {
    if (!customerId) { setLoading(false); return; }
    getMemberProfile(customerId)
      .then(result => {
        const profile = Array.isArray(result) ? result[0] : result;
        setCardNumber(profile?.CARD_NUMBER ? String(profile.CARD_NUMBER) : null);
      })
      .catch(() => { setCardNumber(null); })
      .finally(() => setLoading(false));
  }, [customerId]);

  return (
    <ScrollView contentContainerStyle={[styles.container, isWide && styles.containerWide]}>

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }, isWide && styles.headerWide]}>
        <Text style={styles.headerLabel}>MY CARD</Text>
      </View>

      {/* Card */}
      <View style={[styles.card, isWide && styles.cardWide]}>
        <View style={styles.cardInner}>
          <Image source={require('../assets/logo.png')} style={[styles.logo, isWide && styles.logoWide]} resizeMode="contain" />

          {loading ? (
            <ActivityIndicator size="large" color="#1a73e8" style={{ marginVertical: 32 }} />
          ) : cardNumber ? (
            <>
              {mode === 'barcode' ? (
                <BarcodeDisplay
                  value={cardNumber}
                  width={isWide ? 2 : 1.5}
                  height={80}
                  maxWidth={isWide ? 360 : 280}
                />
              ) : (
                <QRCode value={cardNumber} size={isWide ? 220 : 180} />
              )}
              <Text style={styles.cardNumber}>{cardNumber}</Text>
            </>
          ) : (
            <Text style={styles.noCard}>Account number unavailable</Text>
          )}
        </View>

        <View style={styles.cardAccent} />
      </View>

      {cardNumber && (
        <View style={styles.toggle}>
          <TouchableOpacity
            style={[styles.toggleBtn, mode === 'barcode' && styles.toggleBtnActive]}
            onPress={() => setMode('barcode')}
          >
            <Text style={[styles.toggleText, mode === 'barcode' && styles.toggleTextActive]}>Barcode</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleBtn, mode === 'qr' && styles.toggleBtnActive]}
            onPress={() => setMode('qr')}
          >
            <Text style={[styles.toggleText, mode === 'qr' && styles.toggleTextActive]}>QR Code</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.hint}>Show this number to earn and redeem points.</Text>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#f4f6f9', alignItems: 'center' },
  containerWide: { justifyContent: 'center', minHeight: '100%' },

  header: {
    width: '100%',
    backgroundColor: '#ffffff',
    paddingTop: 16,
    paddingBottom: 48,
    alignItems: 'center',
  },
  headerWide: {
    paddingBottom: 32,
    borderRadius: 0,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    color: 'rgba(26,42,74,0.5)',
    marginBottom: 6,
  },

  card: {
    width: '96%',
    borderRadius: 18,
    backgroundColor: '#ffffff',
    marginTop: -28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  cardWide: {
    width: '100%',
    maxWidth: 520,
    marginTop: 0,
  },
  cardInner: {
    padding: 32,
    alignItems: 'center',
  },
  logo: { width: 160, height: 64, marginBottom: 24 },
  logoWide: { width: 200, height: 72 },
  cardNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a2a4a',
    letterSpacing: 3,
    marginTop: 20,
  },
  noCard: { fontSize: 14, color: '#888' },
  cardAccent: { height: 6, backgroundColor: '#1a73e8' },

  toggle: {
    flexDirection: 'row',
    marginTop: 20,
    backgroundColor: '#e8edf5',
    borderRadius: 10,
    padding: 4,
  },
  toggleBtn: { paddingVertical: 8, paddingHorizontal: 24, borderRadius: 8 },
  toggleBtnActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleText: { fontSize: 13, fontWeight: '600', color: '#888' },
  toggleTextActive: { color: '#1a2a4a' },

  hint: {
    marginTop: 16,
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
