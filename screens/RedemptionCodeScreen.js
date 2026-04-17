import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import QRCode from 'react-native-qrcode-svg';
import BarcodeDisplay from '../components/BarcodeDisplay';
import { useBreakpoint } from '../hooks/useBreakpoint';

export default function RedemptionCodeScreen({ route }) {
  const { reward } = route.params;
  const { isWide } = useBreakpoint();
  const [mode, setMode] = useState('barcode');
  const codeValue = String(reward.DETAIL_ID).replace(/\D/g, '');

  return (
    <View style={styles.container}>
      <Text style={styles.merchantName}>{reward.NAME}</Text>
      <Text style={styles.offer}>{reward.OFFER}</Text>

      <View style={[styles.barcodeCard, isWide && styles.barcodeCardWide]}>
        {mode === 'barcode' ? (
          <BarcodeDisplay
            value={codeValue}
            width={2}
            height={80}
            maxWidth={isWide ? 400 : 280}
          />
        ) : (
          <QRCode value={codeValue} size={isWide ? 220 : 180} />
        )}
        <Text style={styles.detailId}>ID: {reward.DETAIL_ID}</Text>
      </View>

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

      <Text style={styles.hint}>Show this code to the merchant to redeem your reward.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f6f9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  merchantName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a2a4a',
    marginBottom: 4,
    textAlign: 'center',
  },
  offer: {
    fontSize: 14,
    color: '#555',
    marginBottom: 32,
    textAlign: 'center',
  },
  barcodeCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 28,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  barcodeCardWide: {
    maxWidth: 520,
  },
  detailId: {
    fontSize: 13,
    color: '#aaa',
    marginTop: 14,
    textAlign: 'center',
  },
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
    marginTop: 24,
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 320,
  },
});
