import { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { navigationRef } from '../App';
import WebFooter from '../components/WebFooter';

function nav(screen) {
  if (navigationRef.isReady()) navigationRef.navigate(screen);
}

const FAQS = [
  {
    q: 'What is the PinPoint Card?',
    a: 'The PinPoint Card is a unique way of rewarding consumers for shopping at their favorite retailers, using a single card at all participating merchants.',
  },
  {
    q: 'Is there a cost to join?',
    a: 'No. Membership is completely free and there are no fees for using the card.',
  },
  {
    q: 'How do I earn points?',
    a: 'Members earn points at participating merchants — typically one or more per dollar spent. Points convert to Payback Rewards once the required threshold is met, and any excess points are saved for future rewards.',
  },
  {
    q: 'Is there anything for which I will not earn points?',
    a: 'Points cannot be earned on tax, gratuity, discounts, and complimentary offers.',
  },
  {
    q: 'How do I enroll for a card?',
    a: 'Member registration may be completed either online at PinPointRewards.com or through one of our smartphone mobile apps.',
  },
  {
    q: 'How do I receive my Payback Rewards?',
    a: 'Rewards load automatically into your account within 24–48 hours of qualifying. You must present the printed or digital reward at the time of redemption.',
  },
  {
    q: 'How long are my points and rewards valid?',
    a: 'Points remain valid for 24 months. Welcome Rewards are valid for 12 months. Payback Rewards are valid for 3 months. Birthday and Anniversary Rewards are valid through the end of the respective month.',
  },
  {
    q: 'How do I receive my Welcome Rewards?',
    a: 'Welcome Rewards will automatically be loaded into your member account upon completion of the enrollment process.',
  },
  {
    q: 'How do I qualify for Birthday and Anniversary Rewards?',
    a: 'Members must use their card at a merchant location at least once prior to their Birthday or Anniversary month.',
  },
  {
    q: 'Can I manage my account?',
    a: 'Yes. Members can check balances, view and print their card and rewards, update their profile, and manage notification settings online or through the mobile app.',
  },
  {
    q: 'Can I add a household member to my account?',
    a: 'Two household members may combine their points through "householding." However, once cards have been separated, they cannot be rejoined afterward.',
  },
  {
    q: 'What if I have account questions?',
    a: 'You can contact us through the website form (expect a 2 business day response) or email our support team for additional assistance.',
  },
  {
    q: 'Can I earn points without my physical card?',
    a: 'Card presentation at the time of purchase is required. Points cannot be applied for any purchase after the time of the visit.',
  },
  {
    q: 'What login information do I need?',
    a: 'Your email address and the password you set during enrollment. Login credentials are included in your welcome email, sent within 24 hours of enrollment.',
  },
  {
    q: 'Is there a points earning limit?',
    a: 'No. There is no limit to the number of points you can earn at any participating PinPoint merchant.',
  },
  {
    q: 'How do I update my profile information?',
    a: 'You can update your profile directly in the mobile app under the Profile tab, or email customerservice@pinpointrewards.com with any changes.',
  },
  {
    q: 'Can I unsubscribe from merchant emails?',
    a: 'Yes, though doing so means you may miss exclusive members-only benefits and other special offer notifications.',
  },
  {
    q: 'Where do I find special offers?',
    a: 'All special offers and discounts are communicated via email and the PinPoint Rewards Facebook page.',
  },
];

function FAQItem({ item, isWide }) {
  const [open, setOpen] = useState(false);
  return (
    <TouchableOpacity
      style={[styles.faqItem, isWide && styles.faqItemWide, open && styles.faqItemOpen]}
      onPress={() => setOpen(o => !o)}
      activeOpacity={0.8}
    >
      <View style={styles.faqHeader}>
        <Text style={[styles.faqQuestion, open && styles.faqQuestionOpen]}>{item.q}</Text>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={18}
          color={open ? '#1a73e8' : '#888'}
          style={{ marginLeft: 12, flexShrink: 0 }}
        />
      </View>
      {open && <Text style={styles.faqAnswer}>{item.a}</Text>}
    </TouchableOpacity>
  );
}

export default function FAQScreen({ navigation }) {
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
        <Text style={styles.heroLabel}>FAQ</Text>
        <Text style={[styles.heroTitle, isWide && styles.heroTitleWide]}>Frequently Asked Questions</Text>
        <Text style={[styles.heroBody, isWide && styles.heroBodyWide]}>
          Everything you need to know about the PinPoint Rewards program.
        </Text>
      </View>

      {/* ── FAQ list ── */}
      <View style={[styles.faqSection, isWide && styles.faqSectionWide]}>
        {FAQS.map(item => (
          <FAQItem key={item.q} item={item} isWide={isWide} />
        ))}
      </View>

      {/* ── Still have questions? ── */}
      <View style={[styles.contactCTA, isWide && styles.contactCTAWide]}>
        <Text style={[styles.contactTitle, isWide && styles.contactTitleWide]}>Still have questions?</Text>
        <Text style={styles.contactBody}>
          Our team is happy to help. Reach out and we'll get back to you within 2 business days.
        </Text>
        <TouchableOpacity style={styles.contactBtn} onPress={() => goTo('Contact')}>
          <Text style={styles.contactBtnText}>Contact Us</Text>
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

  faqSection: { paddingVertical: 48, paddingHorizontal: 24, gap: 8, backgroundColor: '#fff' },
  faqSectionWide: { paddingHorizontal: 64, paddingVertical: 64, maxWidth: 900, alignSelf: 'center', width: '100%' },

  faqItem: {
    backgroundColor: '#f4f6f9',
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  faqItemWide: { padding: 22 },
  faqItemOpen: { borderColor: '#1a73e8', backgroundColor: '#eef4fd' },
  faqHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  faqQuestion: { flex: 1, fontSize: 15, fontWeight: '600', color: NAVY, lineHeight: 22 },
  faqQuestionOpen: { color: BLUE },
  faqAnswer: { fontSize: 14, color: '#444', lineHeight: 24, marginTop: 12 },

  contactCTA: { backgroundColor: BLUE, paddingVertical: 56, paddingHorizontal: 24, alignItems: 'center' },
  contactCTAWide: { paddingVertical: 72 },
  contactTitle: { fontSize: 26, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 12 },
  contactTitleWide: { fontSize: 34 },
  contactBody: { fontSize: 16, color: 'rgba(255,255,255,0.8)', textAlign: 'center', lineHeight: 26, marginBottom: 28, maxWidth: 480 },
  contactBtn: { backgroundColor: '#fff', paddingHorizontal: 28, paddingVertical: 14, borderRadius: 10 },
  contactBtnText: { color: BLUE, fontWeight: '700', fontSize: 16 },

});
