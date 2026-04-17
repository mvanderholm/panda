import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { navigationRef } from '../App';

function nav(screen) {
  if (navigationRef.isReady()) navigationRef.navigate(screen);
}

const COMPARISONS = [
  {
    icon: 'card-outline',
    title: 'Unlike expensive membership cards',
    body: 'Most membership cards only work in specific industries and expire every year. PinPoint is absolutely free, has no time limit, and works across many different industries.',
  },
  {
    icon: 'book-outline',
    title: 'Unlike bulky coupon books',
    body: 'Coupon books are only good for one visit per store. The PinPoint Card is easy to use and rewards you as many times as you shop.',
  },
  {
    icon: 'trending-up-outline',
    title: 'Unlike high-threshold programs',
    body: 'Some programs require you to spend large amounts before claiming any rewards. PinPoint reward points add up fast — every dollar counts.',
  },
  {
    icon: 'heart-outline',
    title: 'Something special when you join',
    body: 'Rather than make you pay to join, PinPoint gives you an exclusive offering of members-only benefits and offers, including coupons from every participating merchant.',
  },
];

const BENEFITS = [
  { icon: 'star-outline',           title: 'Earn Points',            body: 'Earn 1 point for every dollar spent at participating locations, building toward valuable Payback Rewards.' },
  { icon: 'flash-outline',          title: 'Double & Triple Points',  body: 'Select merchants offer bonus point multipliers — earn rewards even faster.' },
  { icon: 'gift-outline',           title: 'Welcome Rewards',         body: 'Exclusive members-only offers load automatically when you complete enrollment.' },
  { icon: 'pricetag-outline',       title: 'Instant Rewards',         body: 'Some merchants offer immediate discounts the moment you present your card.' },
  { icon: 'calendar-outline',       title: 'Birthday & Anniversary',  body: 'Qualify for special rewards during your birthday or anniversary month.' },
  { icon: 'card-outline',           title: 'Gift Card Points',        body: 'Earn points on gift card purchases at participating locations.' },
  { icon: 'desktop-outline',        title: '24-Hour Account Access',  body: 'Check point balances, print rewards, and update your profile anytime online.' },
  { icon: 'mail-outline',           title: 'Email Notifications',     body: 'Stay informed about new rewards, special offers, and account activity.' },
  { icon: 'logo-facebook',          title: 'Facebook Exclusives',     body: 'Fan-only access to special offers, gift card giveaways, and ticket event promotions.' },
];

export default function LearnMoreScreen({ navigation }) {
  const { isWide, isDesktop } = useBreakpoint();
  const isWeb = Platform.OS === 'web';

  const goTo = (screen) => {
    if (isWeb && isWide) nav(screen);
    else navigation.navigate(screen);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* ── Page hero ── */}
      <View style={[styles.hero, isWide && styles.heroWide]}>
        <Text style={[styles.heroLabel]}>LEARN MORE</Text>
        <Text style={[styles.heroTitle, isWide && styles.heroTitleWide]}>
          A groundbreaking savings &amp; rewards program
        </Text>
        <Text style={[styles.heroBody, isWide && styles.heroBodyWide]}>
          PinPoint offers members discounts and rewards at a wide variety of merchants through the use of a single card — the PinPoint Card.
        </Text>
        <TouchableOpacity style={styles.heroCTA} onPress={() => goTo('Enrollment')}>
          <Text style={styles.heroCTAText}>Get a Free Card</Text>
        </TouchableOpacity>
      </View>

      {/* ── How PinPoint is different ── */}
      <View style={[styles.section, isWide && styles.sectionWide]}>
        <Text style={styles.sectionLabel}>WHY PINPOINT</Text>
        <Text style={[styles.sectionTitle, isWide && styles.sectionTitleWide]}>Different from anything else out there</Text>
        <View style={[styles.compGrid, isWide && styles.compGridWide]}>
          {COMPARISONS.map(c => (
            <View key={c.title} style={[styles.compCard, isWide && styles.compCardWide]}>
              <View style={styles.compIconWrap}>
                <Ionicons name={c.icon} size={22} color="#1a73e8" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.compTitle}>{c.title}</Text>
                <Text style={styles.compBody}>{c.body}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* ── Full benefits list ── */}
      <View style={[styles.benefitsSection, isWide && styles.benefitsSectionWide]}>
        <Text style={styles.sectionLabel}>MEMBER BENEFITS</Text>
        <Text style={[styles.sectionTitle, isWide && styles.sectionTitleWide]}>As a PinPoint cardholder, you receive:</Text>
        <View style={[styles.benefitsGrid, isDesktop ? styles.benefitsGrid3 : isWide ? styles.benefitsGrid2 : null]}>
          {BENEFITS.map(b => (
            <View key={b.title} style={[styles.benefitCard, isWide && styles.benefitCardWide]}>
              <View style={styles.benefitIconWrap}>
                <Ionicons name={b.icon} size={20} color="#1a73e8" />
              </View>
              <Text style={styles.benefitTitle}>{b.title}</Text>
              <Text style={styles.benefitBody}>{b.body}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.disclaimer}>* Restrictions may apply.</Text>
      </View>

      {/* ── Bottom CTA ── */}
      <View style={[styles.cta, isWide && styles.ctaWide]}>
        <Text style={[styles.ctaTitle, isWide && styles.ctaTitleWide]}>
          Ready to start earning?
        </Text>
        <View style={styles.ctaButtons}>
          <TouchableOpacity style={styles.ctaPrimary} onPress={() => goTo('Enrollment')}>
            <Text style={styles.ctaPrimaryText}>Get a Free Card</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ctaSecondary} onPress={() => goTo('FAQ')}>
            <Text style={styles.ctaSecondaryText}>Read the FAQ</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Footer ── */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2026 PinPointRewards.com. All rights reserved.</Text>
      </View>

    </ScrollView>
  );
}

const BLUE = '#1a73e8';
const NAVY = '#1a2a4a';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  content: { paddingBottom: 0 },

  hero: {
    backgroundColor: NAVY,
    paddingVertical: 56,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  heroWide: { paddingVertical: 72, paddingHorizontal: 0 },
  heroLabel: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.6)', letterSpacing: 1.5, marginBottom: 12 },
  heroTitle: { fontSize: 32, fontWeight: '800', color: '#fff', textAlign: 'center', lineHeight: 40, marginBottom: 16, maxWidth: 640 },
  heroTitleWide: { fontSize: 44, lineHeight: 54 },
  heroBody: { fontSize: 16, color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 26, marginBottom: 28, maxWidth: 580 },
  heroBodyWide: { fontSize: 18 },
  heroCTA: { backgroundColor: BLUE, paddingHorizontal: 28, paddingVertical: 14, borderRadius: 10 },
  heroCTAText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  section: { paddingVertical: 56, paddingHorizontal: 24, backgroundColor: '#fff' },
  sectionWide: { paddingVertical: 72, paddingHorizontal: 64, maxWidth: 1200, alignSelf: 'center', width: '100%' },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: BLUE, letterSpacing: 1.5, textAlign: 'center', marginBottom: 8 },
  sectionTitle: { fontSize: 26, fontWeight: '800', color: NAVY, textAlign: 'center', marginBottom: 36, lineHeight: 34 },
  sectionTitleWide: { fontSize: 34 },

  compGrid: { gap: 16 },
  compGridWide: { flexDirection: 'row', flexWrap: 'wrap' },
  compCard: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: '#f4f6f9',
    borderRadius: 12,
    padding: 16,
    alignItems: 'flex-start',
  },
  compCardWide: { flex: 1, minWidth: 280 },
  compIconWrap: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#eef4fd', justifyContent: 'center', alignItems: 'center' },
  compTitle: { fontSize: 15, fontWeight: '700', color: NAVY, marginBottom: 4 },
  compBody: { fontSize: 14, color: '#555', lineHeight: 22 },

  benefitsSection: { paddingVertical: 56, paddingHorizontal: 24, backgroundColor: '#f4f6f9' },
  benefitsSectionWide: { paddingVertical: 72, paddingHorizontal: 64, maxWidth: 1200, alignSelf: 'center', width: '100%' },
  benefitsGrid: { gap: 12 },
  benefitsGrid2: { flexDirection: 'row', flexWrap: 'wrap' },
  benefitsGrid3: { flexDirection: 'row', flexWrap: 'wrap' },
  benefitCard: { backgroundColor: '#fff', borderRadius: 12, padding: 18, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  benefitCardWide: { flex: 1, minWidth: 240 },
  benefitIconWrap: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#eef4fd', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  benefitTitle: { fontSize: 15, fontWeight: '700', color: NAVY, marginBottom: 4 },
  benefitBody: { fontSize: 13, color: '#555', lineHeight: 20 },
  disclaimer: { fontSize: 12, color: '#999', marginTop: 16, textAlign: 'center' },

  cta: { backgroundColor: BLUE, paddingVertical: 56, paddingHorizontal: 24, alignItems: 'center' },
  ctaWide: { paddingVertical: 72 },
  ctaTitle: { fontSize: 26, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 28, maxWidth: 560 },
  ctaTitleWide: { fontSize: 34 },
  ctaButtons: { flexDirection: 'row', gap: 12, flexWrap: 'wrap', justifyContent: 'center' },
  ctaPrimary: { backgroundColor: '#fff', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 10 },
  ctaPrimaryText: { color: BLUE, fontWeight: '700', fontSize: 16 },
  ctaSecondary: { borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 10 },
  ctaSecondaryText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  footer: { backgroundColor: NAVY, paddingVertical: 28, alignItems: 'center' },
  footerText: { color: 'rgba(255,255,255,0.4)', fontSize: 13 },
});
