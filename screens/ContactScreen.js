import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { navigationRef } from '../App';
import WebFooter from '../components/WebFooter';

function nav(screen) {
  if (navigationRef.isReady()) navigationRef.navigate(screen);
}

const SOCIAL = [
  { name: 'Facebook',  icon: 'logo-facebook',  url: 'https://facebook.com/pinpointrewards',  color: '#1877f2' },
  { name: 'Instagram', icon: 'logo-instagram',  url: 'https://instagram.com/pinpointrewards/', color: '#e1306c' },
  { name: 'Twitter',   icon: 'logo-twitter',    url: 'https://twitter.com/pinpointrewards',   color: '#1da1f2' },
  { name: 'YouTube',   icon: 'logo-youtube',    url: 'https://youtube.com/channel/UC8w-e8mQsvpONhM-hnxHtIw', color: '#ff0000' },
];

export default function ContactScreen({ navigation }) {
  const { isWide } = useBreakpoint();
  const isWeb = Platform.OS === 'web';

  const goTo = (screen) => {
    if (isWeb && isWide) nav(screen);
    else navigation.navigate(screen);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* ── Hero ── */}
      <View style={[styles.hero, isWide && styles.heroWide]}>
        <Text style={styles.heroLabel}>CONTACT</Text>
        <Text style={[styles.heroTitle, isWide && styles.heroTitleWide]}>Get in Touch</Text>
        <Text style={[styles.heroBody, isWide && styles.heroBodyWide]}>
          Have a question about your account or the program? We're here to help.
        </Text>
      </View>

      {/* ── Contact cards ── */}
      <View style={[styles.cardsSection, isWide && styles.cardsSectionWide]}>
        <View style={[styles.cardsRow, isWide && styles.cardsRowWide]}>

          {/* Email */}
          <View style={[styles.card, isWide && styles.cardWide]}>
            <View style={styles.cardIconWrap}>
              <Ionicons name="mail-outline" size={26} color="#1a73e8" />
            </View>
            <Text style={styles.cardTitle}>Email Us</Text>
            <Text style={styles.cardBody}>
              Send us a message and we'll get back to you within 2 business days.
            </Text>
            <TouchableOpacity
              style={styles.cardLink}
              onPress={() => Linking.openURL('mailto:info@pinpointrewards.com')}
            >
              <Text style={styles.cardLinkText}>info@pinpointrewards.com</Text>
              <Ionicons name="arrow-forward" size={14} color="#1a73e8" />
            </TouchableOpacity>
          </View>

          {/* Address */}
          <View style={[styles.card, isWide && styles.cardWide]}>
            <View style={styles.cardIconWrap}>
              <Ionicons name="location-outline" size={26} color="#1a73e8" />
            </View>
            <Text style={styles.cardTitle}>Our Office</Text>
            <Text style={styles.cardBody}>
              14222 Hillsdale Circle{'\n'}Omaha, NE 68137
            </Text>
            <TouchableOpacity
              style={styles.cardLink}
              onPress={() => Linking.openURL('https://www.google.com/maps/search/?api=1&query=14222+Hillsdale+Circle+Omaha+NE+68137')}
            >
              <Text style={styles.cardLinkText}>View on Map</Text>
              <Ionicons name="arrow-forward" size={14} color="#1a73e8" />
            </TouchableOpacity>
          </View>

          {/* Customer service */}
          <View style={[styles.card, isWide && styles.cardWide]}>
            <View style={styles.cardIconWrap}>
              <Ionicons name="help-circle-outline" size={26} color="#1a73e8" />
            </View>
            <Text style={styles.cardTitle}>Account Support</Text>
            <Text style={styles.cardBody}>
              For account-specific questions, email our customer service team directly.
            </Text>
            <TouchableOpacity
              style={styles.cardLink}
              onPress={() => Linking.openURL('mailto:customerservice@pinpointrewards.com')}
            >
              <Text style={styles.cardLinkText}>customerservice@pinpointrewards.com</Text>
              <Ionicons name="arrow-forward" size={14} color="#1a73e8" />
            </TouchableOpacity>
          </View>

        </View>
      </View>

      {/* ── Social ── */}
      <View style={[styles.socialSection, isWide && styles.socialSectionWide]}>
        <Text style={styles.socialTitle}>Follow Us</Text>
        <Text style={styles.socialBody}>Stay up to date with offers, promotions, and news.</Text>
        <View style={styles.socialRow}>
          {SOCIAL.map(s => (
            <TouchableOpacity
              key={s.name}
              style={styles.socialBtn}
              onPress={() => Linking.openURL(s.url)}
              activeOpacity={0.75}
            >
              <Ionicons name={s.icon} size={22} color={s.color} />
              <Text style={styles.socialBtnText}>{s.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── FAQ prompt ── */}
      <View style={[styles.faqPrompt, isWide && styles.faqPromptWide]}>
        <Text style={[styles.faqPromptTitle, isWide && styles.faqPromptTitleWide]}>
          Looking for quick answers?
        </Text>
        <Text style={styles.faqPromptBody}>
          Browse our FAQ for answers to the most common questions about points, rewards, and your account.
        </Text>
        <TouchableOpacity style={styles.faqBtn} onPress={() => goTo('FAQ')}>
          <Text style={styles.faqBtnText}>View FAQ</Text>
        </TouchableOpacity>
      </View>

      <WebFooter />

    </ScrollView>
  );
}

const BLUE = '#1a73e8';
const NAVY = '#1a2a4a';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  content: { paddingBottom: 0 },

  hero: { backgroundColor: NAVY, paddingVertical: 56, paddingHorizontal: 24, alignItems: 'center' },
  heroWide: { paddingVertical: 72 },
  heroLabel: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.6)', letterSpacing: 1.5, marginBottom: 12 },
  heroTitle: { fontSize: 32, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 12 },
  heroTitleWide: { fontSize: 44 },
  heroBody: { fontSize: 16, color: 'rgba(255,255,255,0.75)', textAlign: 'center', lineHeight: 26, maxWidth: 520 },
  heroBodyWide: { fontSize: 18 },

  cardsSection: { paddingVertical: 56, paddingHorizontal: 24, backgroundColor: '#fff' },
  cardsSectionWide: { paddingVertical: 72, paddingHorizontal: 64, maxWidth: 1200, alignSelf: 'center', width: '100%' },
  cardsRow: { gap: 16 },
  cardsRowWide: { flexDirection: 'row', gap: 20 },

  card: {
    backgroundColor: '#f4f6f9',
    borderRadius: 14,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  cardWide: { flex: 1 },
  cardIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: '#eef4fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: { fontSize: 17, fontWeight: '700', color: NAVY, marginBottom: 8 },
  cardBody: { fontSize: 14, color: '#555', lineHeight: 22, marginBottom: 14 },
  cardLink: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardLinkText: { fontSize: 14, color: BLUE, fontWeight: '600', flex: 1, flexShrink: 1 },

  socialSection: { paddingVertical: 56, paddingHorizontal: 24, backgroundColor: '#f4f6f9', alignItems: 'center' },
  socialSectionWide: { paddingVertical: 64 },
  socialTitle: { fontSize: 22, fontWeight: '700', color: NAVY, marginBottom: 8 },
  socialBody: { fontSize: 15, color: '#555', textAlign: 'center', marginBottom: 28 },
  socialRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', justifyContent: 'center' },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  socialBtnText: { fontSize: 14, fontWeight: '600', color: '#333' },

  faqPrompt: { backgroundColor: BLUE, paddingVertical: 56, paddingHorizontal: 24, alignItems: 'center' },
  faqPromptWide: { paddingVertical: 72 },
  faqPromptTitle: { fontSize: 26, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 12 },
  faqPromptTitleWide: { fontSize: 34 },
  faqPromptBody: { fontSize: 16, color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 26, marginBottom: 28, maxWidth: 500 },
  faqBtn: { backgroundColor: '#fff', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 10 },
  faqBtnText: { color: BLUE, fontWeight: '700', fontSize: 16 },

});
