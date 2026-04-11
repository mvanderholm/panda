import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useEffect, useState } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Barcode from '@kichiyaki/react-native-barcode-generator';
import QRCode from 'react-native-qrcode-svg';
import { useAuth } from '../AuthContext';
import { getMemberProfile } from '../api';

export default function MyCardScreen() {
  const { customerId } = useAuth();
  const insets = useSafeAreaInsets();
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
      .catch(err => { console.error('GetMemberProfile error:', err); setCardNumber(null); })
      .finally(() => setLoading(false));
  }, [customerId]);

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <Text style={styles.headerLabel}>MY CARD</Text>
      </View>

      {/* Card */}
      <View style={styles.card}>
        <View style={styles.cardInner}>
          <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />

          {loading ? (
            <ActivityIndicator size="large" color="#1a73e8" style={{ marginVertical: 32 }} />
          ) : cardNumber ? (
            <>
              {mode === 'barcode' ? (
                <Barcode
                  value={cardNumber}
                  format="CODE128"
                  width={1.5}
                  height={80}
                />
              ) : (
                <QRCode value={cardNumber} size={180} />
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

  header: {
    width: '100%',
    backgroundColor: '#ffffff',
    paddingTop: 16,
    paddingBottom: 48,
    alignItems: 'center',
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
  cardInner: {
    padding: 32,
    alignItems: 'center',
  },
  logo: {
    width: 160,
    height: 64,
    marginBottom: 24,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a2a4a',
    letterSpacing: 3,
    marginTop: 20,
  },
  noCard: {
    fontSize: 14,
    color: '#888',
  },
  cardAccent: {
    height: 6,
    backgroundColor: '#1a73e8',
  },

  toggle: {
    flexDirection: 'row',
    marginTop: 20,
    backgroundColor: '#e8edf5',
    borderRadius: 10,
    padding: 4,
  },
  toggleBtn: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  toggleBtnActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
  },
  toggleTextActive: {
    color: '#1a2a4a',
  },

  hint: {
    marginTop: 16,
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
