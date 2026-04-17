import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useBreakpoint } from '../hooks/useBreakpoint';

const SECTIONS = [
  {
    heading: 'Introduction',
    body: `PinPoint Card ® Inc. fully supports your right to protect your privacy and will do nothing to jeopardize that right. PinPoint Card ® Inc. is committed to maintaining strong privacy protections for our users. Our Privacy Policy is designed to help you understand how we collect, use and safeguard the information you provide to us and to assist you in making informed decisions when using our website.`,
  },
  {
    heading: 'Choice / Opt-out for Merchant Emails',
    body: `This site gives users the following options for removing their information from our database to not receive future communications or to no longer receive our service. You can send email to customerservice@pinpointrewards.com requesting to be unsubscribed from the mailing list.\n\nPlease be aware that when unsubscribing from merchant emails, you are indicating that you do not wish to receive any exclusive members-only benefits and other special offer notifications from those merchants.`,
  },
  {
    heading: 'Information Collected',
    body: `This website collects personal information from our users. This information includes:\n\n• IP address\n• Browser information\n• Name\n• Email address\n• Mailing address\n• Telephone number\n\nThis site collects personal information from our users at several different points on our website as outlined above.`,
  },
  {
    heading: 'We Protect Visitor Information',
    body: `This website takes every precaution to protect our users' information. When users submit sensitive information via the website, their information is protected both online and off-line.\n\nWhen our registration form asks users to enter sensitive information, that information is encrypted and is protected with industry-standard SSL (Secure Socket Layer) encryption software. While on a secure page, such as our order form, the lock icon on the bottom of Web browsers becomes locked, as opposed to un-locked, or open, when you are just 'surfing'.\n\nWhile we use SSL encryption to protect sensitive information online, we also do everything in our power to protect user-information off-line. All of our users' information — not just the sensitive information mentioned above — is restricted in our offices. Only employees who need the information to perform a specific job are granted access to personally identifiable information. Finally, the servers that we store personally identifiable information on are kept in a secure environment.`,
  },
  {
    heading: 'Your Privacy at Other Sites',
    body: `This website contains links to other sites. Please be aware that we are not responsible for the privacy practices of such other sites. We encourage our users to be aware when they leave our site and to read the privacy statements of each and every Web site that collects personally identifiable information. This privacy statement applies solely to information collected by this Web site.`,
  },
  {
    heading: 'Our Disclosure Policy',
    body: `PinPoint Card ® Inc. will never sell, share, distribute, or otherwise disclose any of our members' credit, debit, check card, or purchasing information to any third party.\n\nPinPoint Card ® Inc. may sell or share our members' mailing list information, including name and postal address, in accordance with the Direct Marketing Association's policies and your opt-out preferences.`,
  },
  {
    heading: 'Your Understanding and Consent',
    body: `By using our website, you consent to the collection and use of this information by PinPoint Card ® Inc. If we decide to change our privacy policy, we will post those changes on this page so that you are always aware of what information we collect, how we use it, and under what circumstances we disclose it.`,
  },
];

export default function PrivacyPolicyScreen() {
  const { isWide } = useBreakpoint();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>

      {/* ── Hero ── */}
      <View style={[styles.hero, isWide && styles.heroWide]}>
        <Text style={styles.heroLabel}>LEGAL</Text>
        <Text style={[styles.heroTitle, isWide && styles.heroTitleWide]}>Privacy Policy</Text>
        <Text style={[styles.heroBody, isWide && styles.heroBodyWide]}>
          How PinPoint Card ® Inc. collects, uses, and protects your personal information.
        </Text>
      </View>

      {/* ── Content ── */}
      <View style={[styles.body, isWide && styles.bodyWide]}>
        {SECTIONS.map(s => (
          <View key={s.heading} style={styles.section}>
            <Text style={styles.sectionHeading}>{s.heading}</Text>
            <Text style={styles.sectionBody}>{s.body}</Text>
          </View>
        ))}
      </View>

    </ScrollView>
  );
}

const NAVY = '#1a2a4a';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9' },
  content: { paddingBottom: 48 },

  hero: { backgroundColor: NAVY, paddingVertical: 56, paddingHorizontal: 24, alignItems: 'center' },
  heroWide: { paddingVertical: 72 },
  heroLabel: { fontSize: 12, fontWeight: '700', color: 'rgba(255,255,255,0.6)', letterSpacing: 1.5, marginBottom: 12 },
  heroTitle: { fontSize: 32, fontWeight: '800', color: '#fff', textAlign: 'center', marginBottom: 12 },
  heroTitleWide: { fontSize: 44 },
  heroBody: { fontSize: 16, color: 'rgba(255,255,255,0.75)', textAlign: 'center', lineHeight: 26, maxWidth: 520 },
  heroBodyWide: { fontSize: 18 },

  body: { paddingVertical: 48, paddingHorizontal: 24 },
  bodyWide: { maxWidth: 800, alignSelf: 'center', width: '100%', paddingVertical: 64, paddingHorizontal: 0 },

  section: { marginBottom: 36 },
  sectionHeading: { fontSize: 18, fontWeight: '700', color: NAVY, marginBottom: 10 },
  sectionBody: { fontSize: 15, color: '#444', lineHeight: 26 },
});
