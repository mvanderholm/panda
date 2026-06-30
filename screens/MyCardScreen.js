import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity, RefreshControl, useWindowDimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useEffect, useState, useCallback } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import QRCode from 'react-native-qrcode-svg';
import * as ScreenOrientation from 'expo-screen-orientation';
import BarcodeDisplay from '../components/BarcodeDisplay';
import { useAuth } from '../AuthContext';
import { getMemberProfile } from '../api';
import { recordError } from '../crashlytics';
import analytics from '../analytics';
import { useBreakpoint } from '../hooks/useBreakpoint';

export default function MyCardScreen() {
  const { customerId } = useAuth();
  const insets = useSafeAreaInsets();
  const { isWide } = useBreakpoint();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [cardNumber, setCardNumber] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [mode, setMode] = useState('barcode');

  useEffect(() => { analytics.screen('MyCard'); }, []);

  useEffect(() => {
    ScreenOrientation.unlockAsync();
    return () => {
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
    };
  }, []);

  const fetchCard = useCallback(async (isRefresh = false) => {
    if (!customerId) { setLoading(false); return; }
    try {
      // On first load, show cached value immediately while fetching
      if (!isRefresh) {
        const cached = await AsyncStorage.getItem(`cached_card_${customerId}`);
        if (cached) { setCardNumber(cached); setLoading(false); }
      }
      const result = await getMemberProfile(customerId);
      const profile = Array.isArray(result) ? result[0] : result;
      const fresh = profile?.CARD_NUMBER ? String(profile.CARD_NUMBER) : null;
      if (fresh) {
        setCardNumber(fresh);
        await AsyncStorage.setItem(`cached_card_${customerId}`, fresh);
      }
    } catch (err) {
      recordError(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [customerId]);

  useEffect(() => { fetchCard(); }, [fetchCard]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchCard(true);
  }, [fetchCard]);

  return (
    <ScrollView
      contentContainerStyle={[styles.container, isWide && styles.containerWide]}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >

      {/* Header — hidden in landscape to maximise scan area */}
      {!isLandscape && (
        <View style={[styles.header, { paddingTop: insets.top + 16 }, isWide && styles.headerWide]}>
          <Text style={styles.headerLabel}>MY CARD</Text>
        </View>
      )}

      {/* Card */}
      <View style={[styles.card, isWide && styles.cardWide, isLandscape && styles.cardLandscape]}>
        {/* Rotate button */}
        <TouchableOpacity
          style={styles.rotateBtn}
          onPress={() => {
            if (isLandscape) {
              ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP);
            } else {
              ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
            }
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
            {isLandscape
              ? <Path d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z" fill="#1a2a4a" opacity="0.4" />
              : <Path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" fill="#1a2a4a" opacity="0.4" />
            }
          </Svg>
        </TouchableOpacity>

        <View style={styles.cardInner}>
          <Image source={require('../assets/logo.png')} style={[styles.logo, isWide && styles.logoWide]} resizeMode="contain" />

          {loading ? (
            <ActivityIndicator size="large" color="#1a73e8" style={{ marginVertical: 32 }} />
          ) : cardNumber ? (
            <>
              {mode === 'barcode' ? (
                <BarcodeDisplay
                  value={cardNumber}
                  width={isLandscape ? 2.5 : isWide ? 2 : 1.5}
                  height={isLandscape ? 100 : 80}
                  maxWidth={isLandscape ? width * 0.7 : isWide ? 360 : 280}
                />
              ) : (
                <QRCode value={cardNumber} size={isLandscape ? 180 : isWide ? 220 : 180} />
              )}
              <Text style={styles.cardNumber} numberOfLines={1} adjustsFontSizeToFit>{cardNumber}</Text>
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

      {cardNumber && (
        <Text style={styles.hint}>Show this number to earn and redeem points.</Text>
      )}

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
  cardLandscape: {
    width: '90%',
    maxWidth: 700,
    marginTop: 12,
  },
  rotateBtn: {
    position: 'absolute',
    top: 10,
    right: 12,
    zIndex: 10,
    padding: 6,
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
