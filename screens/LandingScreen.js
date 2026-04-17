import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { navigationRef } from '../App';

function nav(screen) {
  if (navigationRef.isReady()) navigationRef.navigate(screen);
}

const FEATURES = [
  { icon: 'star-outline',     title: 'Earn Points',               body: 'Earn 1 point for every dollar spent at participating locations.' },
  { icon: 'flash-outline',    title: 'Double & Triple Points',    body: 'Select merchants offer bonus point multipliers on every visit.' },
  { icon: 'gift-outline',     title: 'Welcome Rewards',           body: 'Receive exclusive member-only offers the moment you enroll.' },
  { icon: 'calendar-outline', title: 'Birthday Rewards',          body: 'Get a special reward during your birthday month just for shopping.' },
  { icon: 'phone-portrait-outline', title: 'Mobile App',          body: 'Manage your card, points, and rewards from your phone.' },
  { icon: 'time-outline',     title: '24-Hour Account Access',    body: 'Check balances, print rewards, and update your profile anytime.' },
];

const HOW_IT_WORKS = [
  { step: '1', title: 'Enroll for Free',   body: 'Sign up online or in the app — no cost, no credit card required.' },
  { step: '2', title: 'Shop at Merchants', body: 'Present your PinPoint Card at any participating local merchant.' },
  { step: '3', title: 'Earn & Redeem',     body: 'Points accumulate automatically and convert to Payback Rewards.' },
];

export default function LandingScreen({ navigation }) {
  const { isWide, isDesktop } = useBreakpoint();
  const isWeb = Platform.OS === 'web';

  // On narrow web, navigation prop is the RN nav; on wide web we use navigationRef
  const goTo = (screen) => {
    if (isWeb && isWide) {
      nav(screen);
    } else {
      navigation.navigate(screen);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* ── Mobile web top bar (narrow only) ── */}
      {isWeb && !isWide && (
        <View style={styles.mobileBar}>
          <Image source={require('../assets/logo.png')} style={styles.mobileBarLogo} resizeMode="contain" />
          <View style={styles.mobileBarActions}>
            <TouchableOpacity style={styles.mobileBarBtn} onPress={() => goTo('Login')}>
              <Text style={styles.mobileBarBtnText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ── Hero ── */}
      <View style={[styles.hero, isWide && styles.heroWide]}>
        <View style={[styles.heroContent, isWide && styles.heroContentWide]}>
          {!isWide && (
            <Image source={require('../assets/logo.png')} style={styles.heroLogo} resizeMode="contain" />
          )}
          <Text style={[styles.heroHeadline, isWide && styles.heroHeadlineWide]}>
            Earn Rewards at{'\n'}Local Merchants
          </Text>
          <Text style={[styles.heroSubhead, isWide && styles.heroSubheadWide]}>
            PinPoint is a free loyalty rewards program that works at hundreds of local
            businesses — one card, dozens of ways to save.
          </Text>
          <View style={[styles.heroCTAs, isWide && styles.heroCTAsWide]}>
            <TouchableOpacity style={styles.ctaPrimary} onPress={() => goTo('Enrollment')}>
              <Text style={styles.ctaPrimaryText}>Get a Free Card</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ctaSecondary} onPress={() => goTo('Login')}>
              <Text style={styles.ctaSecondaryText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
        {isWide && (
          <View style={styles.heroImageCol}>
            <View style={styles.heroCard}>
              <Image source={require('../assets/logo.png')} style={styles.heroCardLogo} resizeMode="contain" />
              <View style={styles.heroCardAccent} />
              <Text style={styles.heroCardTag}>Free to join · No expiry</Text>
            </View>
          </View>
        )}
      </View>

      {/* ── How It Works ── */}
      <View style={[styles.section, isWide && styles.sectionWide]}>
        <Text style={styles.sectionLabel}>HOW IT WORKS</Text>
        <Text style={[styles.sectionTitle, isWide && styles.sectionTitleWide]}>Three steps to start saving</Text>
        <View style={[styles.stepsRow, isWide && styles.stepsRowWide]}>
          {HOW_IT_WORKS.map((item, i) => (
            <View key={item.step} style={[styles.step, isWide && styles.stepWide]}>
              <View style={styles.stepBubble}>
                <Text style={styles.stepNumber}>{item.step}</Text>
              </View>
              {isWide && i < HOW_IT_WORKS.length - 1 && <View style={styles.stepConnector} />}
              <Text style={styles.stepTitle}>{item.title}</Text>
              <Text style={styles.stepBody}>{item.body}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── Features ── */}
      <View style={[styles.featuresSection, isWide && styles.featuresSectionWide]}>
        <Text style={styles.sectionLabel}>MEMBER BENEFITS</Text>
        <Text style={[styles.sectionTitle, isWide && styles.sectionTitleWide]}>Everything included, always free</Text>
        <View style={[styles.featuresGrid, isDesktop ? styles.featuresGrid3 : isWide ? styles.featuresGrid2 : null]}>
          {FEATURES.map(f => (
            <View key={f.title} style={[styles.featureCard, isWide && styles.featureCardWide]}>
              <View style={styles.featureIconWrap}>
                <Ionicons name={f.icon} size={24} color="#1a73e8" />
              </View>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureBody}>{f.body}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* ── Find Merchants CTA ── */}
      <View style={[styles.merchantsCTA, isWide && styles.merchantsCTAWide]}>
        <Text style={[styles.merchantsCTATitle, isWide && styles.merchantsCTATitleWide]}>
          Hundreds of local merchants, one card.
        </Text>
        <Text style={styles.merchantsCTABody}>
          Browse the full directory of participating restaurants, retailers, services, and more in your area.
        </Text>
        <TouchableOpacity style={styles.ctaPrimaryDark} onPress={() => goTo('FindMerchants')}>
          <Text style={styles.ctaPrimaryDarkText}>Find Merchants Near You</Text>
        </TouchableOpacity>
      </View>

      {/* ── Bottom CTA ── */}
      <View style={[styles.bottomCTA, isWide && styles.bottomCTAWide]}>
        <Text style={[styles.bottomCTATitle, isWide && styles.bottomCTATitleWide]}>
          It's free, it's easy, and the rewards just keep coming.
        </Text>
        <TouchableOpacity style={styles.ctaPrimaryLarge} onPress={() => goTo('Enrollment')}>
          <Text style={styles.ctaPrimaryText}>Become a PinPoint Member</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => goTo('LearnMore')}>
          <Text style={styles.learnMoreLink}>Learn more about the program →</Text>
        </TouchableOpacity>
      </View>

      {/* ── Footer ── */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2026 PinPointRewards.com. All rights reserved.</Text>
        <View style={styles.footerLinks}>
          <TouchableOpacity onPress={() => goTo('LearnMore')}><Text style={styles.footerLink}>Learn More</Text></TouchableOpacity>
          <Text style={styles.footerDot}>·</Text>
          <TouchableOpacity onPress={() => goTo('FindMerchants')}><Text style={styles.footerLink}>Find Merchants</Text></TouchableOpacity>
          <Text style={styles.footerDot}>·</Text>
          <TouchableOpacity onPress={() => goTo('FAQ')}><Text style={styles.footerLink}>FAQ</Text></TouchableOpacity>
          <Text style={styles.footerDot}>·</Text>
          <TouchableOpacity onPress={() => goTo('Contact')}><Text style={styles.footerLink}>Contact</Text></TouchableOpacity>
          <Text style={styles.footerDot}>·</Text>
          <TouchableOpacity onPress={() => goTo('PrivacyPolicy')}><Text style={styles.footerLink}>Privacy Policy</Text></TouchableOpacity>
        </View>
      </View>

    </ScrollView>
  );
}

const BLUE = '#1a73e8';
const NAVY = '#1a2a4a';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  content: { paddingBottom: 0 },

  // Mobile web bar
  mobileBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e8e8e8',
  },
  mobileBarLogo: { width: 130, height: 36 },
  mobileBarActions: { flexDirection: 'row', gap: 8 },
  mobileBarBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1.5, borderColor: BLUE },
  mobileBarBtnText: { fontSize: 14, fontWeight: '600', color: BLUE },

  // Hero
  hero: {
    backgroundColor: NAVY,
    paddingVertical: 64,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  heroWide: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 64,
    paddingVertical: 80,
    gap: 64,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  heroContent: { alignItems: 'center', maxWidth: 520 },
  heroContentWide: { alignItems: 'flex-start', flex: 1 },
  heroLogo: { width: 180, height: 60, marginBottom: 24 },
  heroHeadline: {
    fontSize: 36,
    fontWeight: '800',
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 44,
    marginBottom: 16,
  },
  heroHeadlineWide: { fontSize: 52, lineHeight: 62, textAlign: 'left' },
  heroSubhead: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 32,
  },
  heroSubheadWide: { fontSize: 18, textAlign: 'left' },
  heroCTAs: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', justifyContent: 'center' },
  heroCTAsWide: { justifyContent: 'flex-start' },
  ctaPrimary: {
    backgroundColor: BLUE,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 10,
  },
  ctaPrimaryText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  ctaSecondary: {
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 10,
  },
  ctaSecondaryText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  heroImageCol: { flex: 1, maxWidth: 340, justifyContent: 'center', alignItems: 'center' },
  heroCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 32,
    elevation: 12,
    overflow: 'hidden',
  },
  heroCardLogo: { width: 200, height: 72, marginBottom: 16 },
  heroCardAccent: { height: 5, backgroundColor: BLUE, width: '100%', borderRadius: 2 },
  heroCardTag: { fontSize: 12, color: '#888', marginTop: 12, fontWeight: '600' },

  // Sections
  section: { paddingVertical: 56, paddingHorizontal: 24, backgroundColor: '#fff' },
  sectionWide: {
    paddingVertical: 72,
    paddingHorizontal: 64,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: BLUE,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: NAVY,
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 36,
  },
  sectionTitleWide: { fontSize: 36, lineHeight: 44 },

  // How it works
  stepsRow: { gap: 24 },
  stepsRowWide: { flexDirection: 'row', gap: 0, alignItems: 'flex-start' },
  step: { alignItems: 'center', gap: 12 },
  stepWide: { flex: 1, alignItems: 'center', position: 'relative', paddingHorizontal: 16 },
  stepBubble: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: BLUE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumber: { fontSize: 22, fontWeight: '800', color: '#fff' },
  stepConnector: {
    position: 'absolute',
    top: 28,
    right: -16,
    left: '50%',
    height: 2,
    backgroundColor: '#d0ddf5',
    zIndex: 0,
  },
  stepTitle: { fontSize: 17, fontWeight: '700', color: NAVY, textAlign: 'center' },
  stepBody: { fontSize: 14, color: '#555', textAlign: 'center', lineHeight: 22 },

  // Features
  featuresSection: { paddingVertical: 56, paddingHorizontal: 24, backgroundColor: '#f4f6f9' },
  featuresSectionWide: {
    paddingVertical: 72,
    paddingHorizontal: 64,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  featuresGrid: { gap: 16 },
  featuresGrid2: { flexDirection: 'row', flexWrap: 'wrap' },
  featuresGrid3: { flexDirection: 'row', flexWrap: 'wrap' },
  featureCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  featureCardWide: { flex: 1, minWidth: 260 },
  featureIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#eef4fd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureTitle: { fontSize: 16, fontWeight: '700', color: NAVY, marginBottom: 6 },
  featureBody: { fontSize: 14, color: '#555', lineHeight: 22 },

  // Merchants CTA
  merchantsCTA: {
    backgroundColor: '#fff',
    paddingVertical: 56,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  merchantsCTAWide: {
    paddingVertical: 72,
    paddingHorizontal: 64,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  merchantsCTATitle: { fontSize: 26, fontWeight: '800', color: NAVY, textAlign: 'center', marginBottom: 12 },
  merchantsCTATitleWide: { fontSize: 34 },
  merchantsCTABody: { fontSize: 16, color: '#555', textAlign: 'center', lineHeight: 26, marginBottom: 28, maxWidth: 560 },
  ctaPrimaryDark: {
    backgroundColor: NAVY,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 10,
  },
  ctaPrimaryDarkText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  // Bottom CTA
  bottomCTA: {
    backgroundColor: BLUE,
    paddingVertical: 64,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  bottomCTAWide: { paddingVertical: 80 },
  bottomCTATitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 32,
    maxWidth: 600,
  },
  bottomCTATitleWide: { fontSize: 32 },
  ctaPrimaryLarge: {
    backgroundColor: '#fff',
    paddingHorizontal: 36,
    paddingVertical: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  learnMoreLink: { color: 'rgba(255,255,255,0.8)', fontSize: 15, fontWeight: '600' },

  // Footer
  footer: {
    backgroundColor: NAVY,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 12,
  },
  footerText: { color: 'rgba(255,255,255,0.5)', fontSize: 13 },
  footerLinks: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 8 },
  footerLink: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '500' },
  footerDot: { color: 'rgba(255,255,255,0.3)', fontSize: 13 },
});
