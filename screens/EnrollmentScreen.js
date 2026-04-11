import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { apiFetch } from '../api';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const GENDERS = [
  { label: 'Male', value: 1 },
  { label: 'Female', value: 2 },
  { label: 'Prefer not to say', value: 0 },
];

export default function EnrollmentScreen({ navigation }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1 — Account
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 2 — Contact
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');

  // Step 3 — Personal (optional)
  const [birthMonth, setBirthMonth] = useState(0);
  const [gender, setGender] = useState(0);

  const validateStep1 = () => {
    if (!first.trim() || !last.trim()) return 'Please enter your first and last name.';
    if (!email.trim() || !email.includes('@')) return 'Please enter a valid email address.';
    if (password.length < 6) return 'Password must be at least 6 characters.';
    if (password !== confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const validateStep2 = () => {
    if (!phone.trim()) return 'Please enter a phone number.';
    return null;
  };

  const handleNext = () => {
    if (step === 1) {
      const err = validateStep1();
      if (err) { Alert.alert('Check your info', err); return; }
    }
    if (step === 2) {
      const err = validateStep2();
      if (err) { Alert.alert('Check your info', err); return; }
    }
    setStep(s => s + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await apiFetch('MemberEnrollment', {
        first: first.trim(),
        last: last.trim(),
        e_mail: email.trim(),
        password,
        phone: phone.trim(),
        address: address.trim(),
        address2: address2.trim(),
        city: city.trim(),
        state: state.trim(),
        zip: zip.trim(),
        country: 'US',
        BD1_Month: birthMonth,
        gender,
        market_id: 0,
        PlatformType: 2,
      });

      const data = typeof result === 'string' ? JSON.parse(result) : result;

      if (data?.type === 2) {
        setStep('success');
      } else if (data?.type === 5) {
        Alert.alert('Already registered', 'An account with that email address already exists. Please sign in instead.');
      } else {
        Alert.alert('Enrollment failed', data?.description || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successIcon}>✓</Text>
        <Text style={styles.successTitle}>You're enrolled!</Text>
        <Text style={styles.successBody}>
          We've sent a verification email to {email}. Please check your inbox and verify your address before signing in.
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Go to Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

        {/* Progress */}
        <View style={styles.progressRow}>
          {[1, 2, 3].map(n => (
            <View key={n} style={[styles.progressDot, step >= n && styles.progressDotActive]} />
          ))}
        </View>

        <Text style={styles.stepLabel}>
          {step === 1 ? 'Step 1 of 3 — Account' : step === 2 ? 'Step 2 of 3 — Contact' : 'Step 3 of 3 — Personal'}
        </Text>

        {/* Step 1 */}
        {step === 1 && (
          <>
            <View style={styles.row}>
              <TextInput style={[styles.input, styles.halfInput]} placeholder="First name" value={first} onChangeText={setFirst} />
              <TextInput style={[styles.input, styles.halfInput]} placeholder="Last name" value={last} onChangeText={setLast} />
            </View>
            <TextInput style={styles.input} placeholder="Email address" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
            <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <TextInput style={styles.input} placeholder="Confirm password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />
          </>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <>
            <TextInput style={styles.input} placeholder="Phone number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />
            <TextInput style={styles.input} placeholder="Apt, suite, etc. (optional)" value={address2} onChangeText={setAddress2} />
            <TextInput style={styles.input} placeholder="City" value={city} onChangeText={setCity} />
            <View style={styles.row}>
              <TextInput style={[styles.input, styles.stateInput]} placeholder="State" value={state} onChangeText={setState} autoCapitalize="characters" maxLength={2} />
              <TextInput style={[styles.input, styles.zipInput]} placeholder="ZIP code" value={zip} onChangeText={setZip} keyboardType="number-pad" maxLength={10} />
            </View>
          </>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <>
            <Text style={styles.sectionLabel}>Birth month (optional)</Text>
            <View style={styles.chipGrid}>
              {MONTHS.map((m, i) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.chip, birthMonth === i + 1 && styles.chipActive]}
                  onPress={() => setBirthMonth(birthMonth === i + 1 ? 0 : i + 1)}
                >
                  <Text style={[styles.chipText, birthMonth === i + 1 && styles.chipTextActive]}>{m.slice(0, 3)}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionLabel}>Gender (optional)</Text>
            <View style={styles.chipRow}>
              {GENDERS.map(g => (
                <TouchableOpacity
                  key={g.value}
                  style={[styles.chip, gender === g.value && styles.chipActive]}
                  onPress={() => setGender(g.value)}
                >
                  <Text style={[styles.chipText, gender === g.value && styles.chipTextActive]}>{g.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Actions */}
        {step < 3 ? (
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
            {loading
              ? <ActivityIndicator color="white" />
              : <Text style={styles.buttonText}>Create Account</Text>
            }
          </TouchableOpacity>
        )}

        {step > 1 && (
          <TouchableOpacity onPress={() => setStep(s => s - 1)}>
            <Text style={styles.backLink}>← Back</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.signinLink}>Already have an account? Sign in</Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f4f6f9',
    padding: 24,
    paddingTop: 60,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#d0d8e8',
  },
  progressDotActive: {
    backgroundColor: '#1a73e8',
  },
  stepLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 0.3,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  halfInput: {
    flex: 1,
  },
  stateInput: {
    width: 80,
  },
  zipInput: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
    marginBottom: 10,
    marginTop: 4,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#e8edf5',
  },
  chipActive: {
    backgroundColor: '#1a73e8',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#555',
  },
  chipTextActive: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#1a73e8',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  backLink: {
    color: '#888',
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 12,
  },
  signinLink: {
    color: '#1a73e8',
    textAlign: 'center',
    fontSize: 14,
  },

  // Success
  successContainer: {
    flex: 1,
    backgroundColor: '#f4f6f9',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  successIcon: {
    fontSize: 64,
    color: '#1a73e8',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1a2a4a',
    marginBottom: 12,
  },
  successBody: {
    fontSize: 15,
    color: '#555',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
});
