import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Update this URL when the hosted privacy policy page is live
const PRIVACY_POLICY_URL = 'https://www.pinpointrewards.com/privacy';

export default function PrivacyPolicyScreen() {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <Text style={styles.title}>Privacy Policy</Text>
      <Text style={styles.body}>
        Our full privacy policy explains how PinPoint collects, uses, and protects your personal information.
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}
        accessibilityRole="link"
        accessibilityLabel="Open privacy policy in browser"
      >
        <Text style={styles.buttonText}>View Full Privacy Policy</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9', padding: 24 },
  title: { fontSize: 22, fontWeight: '700', color: '#1a2a4a', marginBottom: 16 },
  body: { fontSize: 15, color: '#555', lineHeight: 24, marginBottom: 32 },
  button: {
    backgroundColor: '#1a73e8', borderRadius: 8,
    padding: 14, alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: '600', fontSize: 16 },
});
