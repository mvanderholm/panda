import { View, Text, Image, TouchableOpacity, StyleSheet, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBreakpoint } from '../hooks/useBreakpoint';
import { navigationRef } from '../App';

function nav(screen) {
  if (navigationRef.isReady()) navigationRef.navigate(screen);
}

const SOCIAL = [
  { name: 'Facebook',  icon: 'logo-facebook',  url: 'https://facebook.com/pinpointrewards',  color: '#1877f2' },
  { name: 'Instagram', icon: 'logo-instagram',  url: 'https://instagram.com/pinpointrewards/', color: '#e1306c' },
  { name: 'Twitter',   icon: 'logo-twitter',    url: 'https://twitter.com/pinpointrewards',   color: '#1da1f2' },
  { name: 'YouTube',   icon: 'logo-youtube',    url: 'https://youtube.com/channel/UC8w-e8mQsvpONhM-hnxHtIw', color: '#ff0000' },
];

function FooterLink({ label, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.link}>{label}</Text>
    </TouchableOpacity>
  );
}

export default function WebFooter() {
  const { isWide } = useBreakpoint();

  return (
    <View style={styles.footer}>
      <View style={[styles.inner, isWide && styles.innerWide]}>

        {/* Col 1 — Brand */}
        <View style={[styles.col, styles.brandCol]}>
          <Image
            source={require('../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.tagline}>
            It's free, it's easy, and the rewards just keep coming.
          </Text>
          <Text style={styles.copy}>© 2026 PinPointRewards.com.{'\n'}All rights reserved.</Text>
        </View>

        {/* Col 2 — Explore */}
        <View style={styles.col}>
          <Text style={styles.colHeading}>Explore</Text>
          <FooterLink label="Home"           onPress={() => nav('Landing')} />
          <FooterLink label="Learn More"     onPress={() => nav('LearnMore')} />
          <FooterLink label="Find Merchants" onPress={() => nav('FindMerchants')} />
          <FooterLink label="Contact"        onPress={() => nav('Contact')} />
        </View>

        {/* Col 3 — Support */}
        <View style={styles.col}>
          <Text style={styles.colHeading}>Support</Text>
          <FooterLink label="FAQ"            onPress={() => nav('FAQ')} />
          <FooterLink label="Privacy Policy" onPress={() => nav('PrivacyPolicy')} />
        </View>

        {/* Col 4 — Connect */}
        <View style={styles.col}>
          <Text style={styles.colHeading}>Connect</Text>
          <View style={styles.socialRow}>
            {SOCIAL.map(s => (
              <TouchableOpacity
                key={s.name}
                style={styles.socialBtn}
                onPress={() => Linking.openURL(s.url)}
                activeOpacity={0.7}
              >
                <Ionicons name={s.icon} size={20} color={s.color} />
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.socialLabels}>
            {SOCIAL.map(s => (
              <TouchableOpacity
                key={s.name}
                onPress={() => Linking.openURL(s.url)}
                activeOpacity={0.7}
              >
                <Text style={styles.socialLabel}>{s.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#1a2a4a',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  inner: {
    gap: 36,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  innerWide: {
    flexDirection: 'row',
    gap: 40,
    alignItems: 'flex-start',
  },

  col: {
    gap: 10,
  },
  brandCol: {
    flex: 2,
    maxWidth: 280,
  },

  logo: {
    width: 150,
    height: 42,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    lineHeight: 20,
    marginBottom: 4,
  },
  copy: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
    lineHeight: 18,
  },

  colHeading: {
    fontSize: 12,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  link: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 26,
  },

  socialRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 2,
  },
  socialBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  socialLabels: {
    gap: 4,
  },
  socialLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 24,
  },
});
