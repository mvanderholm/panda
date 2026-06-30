import { useEffect, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SLIDES = [
  {
    icon: 'card-outline',
    headline: 'Your loyalty card',
    body: 'Show your card at checkout whenever you shop at a participating merchant. No plastic required.',
    color: '#1a73e8',
  },
  {
    icon: 'storefront-outline',
    headline: 'Earn points automatically',
    body: "Every visit earns you points toward rewards. Check the Merchants tab to see who's participating near you.",
    color: '#2e7d32',
  },
  {
    icon: 'gift-outline',
    headline: 'Redeem your rewards',
    body: 'Once you\'ve earned a reward, tap it in the Rewards tab to get your barcode — then show it at the register.',
    color: '#f57f17',
  },
];

export default function OnboardingModal({ visible, onDismiss }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (visible) setIndex(0);
  }, [visible]);

  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  const dismiss = async () => {
    await AsyncStorage.setItem('onboarding_complete', '1');
    onDismiss();
  };

  const next = () => {
    if (isLast) dismiss();
    else setIndex(i => i + 1);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={dismiss}>
      <View style={styles.overlay}>
        <View style={styles.card}>

          <TouchableOpacity style={styles.skipBtn} onPress={dismiss}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>

          <View style={[styles.iconWrap, { backgroundColor: slide.color + '18' }]}>
            <Ionicons name={slide.icon} size={60} color={slide.color} />
          </View>

          <Text style={styles.headline}>{slide.headline}</Text>
          <Text style={styles.body}>{slide.body}</Text>

          <View style={styles.dots}>
            {SLIDES.map((_, i) => (
              <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
            ))}
          </View>

          <TouchableOpacity style={styles.nextBtn} onPress={next}>
            <Text style={styles.nextText}>{isLast ? 'Get Started' : 'Next'}</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
  },
  skipBtn: {
    alignSelf: 'flex-end',
    paddingVertical: 4,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  skipText: {
    fontSize: 14,
    color: '#aaa',
    fontWeight: '600',
  },
  iconWrap: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  headline: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a2a4a',
    textAlign: 'center',
    marginBottom: 12,
  },
  body: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 28,
    paddingHorizontal: 8,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
  },
  dotActive: {
    backgroundColor: '#1a2a4a',
    width: 20,
  },
  nextBtn: {
    backgroundColor: '#1a2a4a',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
  },
  nextText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
