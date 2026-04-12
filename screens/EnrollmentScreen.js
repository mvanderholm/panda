import { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { enrollMember } from '../api';
import analytics from '../analytics';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const GENDERS = [
  { label: 'Male', value: 1 },
  { label: 'Female', value: 2 },
  { label: 'Prefer not to say', value: 0 },
];

// Returns { label, color, score } for the given password string.
function passwordStrength(pw) {
  if (!pw) return { label: '', color: '#888', score: 0 };
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 2) return { label: 'Weak', color: '#d32f2f', score };
  if (score === 3) return { label: 'Medium', color: '#f57c00', score };
  return { label: 'Strong', color: '#2e7d32', score };
}

// Formats a string of digits as (123) 456-7890 for display.
function formatPhone(raw) {
  const digits = (raw || '').replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

// Returns only the digit characters from a phone string.
function digitsOnly(value) {
  return (value || '').replace(/\D/g, '');
}

export default function EnrollmentScreen({ navigation }) {
  useEffect(() => {
    analytics.track('SignupStarted');
  }, []);

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1 — Account
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 2 — Contact
  const [phone, setPhone] = useState('');        // display value e.g. (123) 456-7890
  const [address, setAddress] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [stateAbbr, setStateAbbr] = useState('');
  const [zip, setZip] = useState('');

  // Step 3 — Personal (optional)
  const [birthMonth, setBirthMonth] = useState(0);
  const [gender, setGender] = useState(0);

  // Per-field inline errors
  const [errors, setErrors] = useState({});

  function setError(field, msg) {
    setErrors(prev => ({ ...prev, [field]: msg }));
  }
  function clearError(field) {
    setErrors(prev => { const next = { ...prev }; delete next[field]; return next; });
  }

  // --- Validation ---

  const validateStep1 = () => {
    const errs = {};
    if (!first.trim()) errs.first = 'First name is required.';
    if (!last.trim()) errs.last = 'Last name is required.';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }
    if (password.length < 8) {
      errs.password = 'Password must be at least 8 characters.';
    } else if (passwordStrength(password).score < 3) {
      errs.password = 'Password is too weak. Add uppercase, numbers, or symbols.';
    }
    if (!confirmPassword) {
      errs.confirmPassword = 'Please confirm your password.';
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }
    return errs;
  };

  const validateStep2 = () => {
    const errs = {};
    const digits = digitsOnly(phone);
    if (!digits) errs.phone = 'Phone number is required.';
    else if (digits.length < 10) errs.phone = 'Please enter a valid 10-digit phone number.';
    return errs;
  };

  // --- Navigation ---

  const handleNext = () => {
    analytics.track('SignupStep', { step });
    let errs = {};
    if (step === 1) errs = validateStep1();
    if (step === 2) errs = validateStep2();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep(s => s + 1);
  };

  // --- Submit ---

  const handleSubmit = async () => {
    setLoading(true);
    analytics.track('SignupSubmitted');
    try {
      const result = await enrollMember({
        first: first.trim(),
        last: last.trim(),
        e_mail: email.trim(),
        password,
        phone: digitsOnly(phone),   // send digits-only to server
        address: address.trim(),
        address2: address2.trim(),
        city: city.trim(),
        state: stateAbbr.trim(),
        zip: zip.trim(),
        country: 'US',
        BD1_Month: birthMonth,
        gender,
        market_id: 0,
        PlatformType: 2,
      });

      const data = typeof result === 'string' ? JSON.parse(result) : result;

      if (data?.type === 2) {
        // Success — persist CustomerID if present and navigate to success state
        analytics.track('SignupSuccess', {
          email: email.trim(),
          CustomerID: data.CustomerID ?? data.CUSTOMER_ID ?? null,
        });
        setStep('success');
      } else if (data?.type === 5) {
        analytics.track('SignupFailed', {
          code: data.code ?? 'already_registered',
          description: data.description ?? 'Customer already exists',
        });
        Alert.alert(
          'Already registered',
          'An account with that email address already exists. Please sign in instead.',
        );
      } else {
        analytics.track('SignupFailed', {
          code: data.code ?? `type_${data?.type}`,
          description: data?.description ?? 'Unknown error',
        });
        Alert.alert('Enrollment failed', data?.description || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      analytics.track('SignupFailed', { code: 'exception', description: err.message });
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- Success screen ---

  if (step === 'success') {
    return (
      <View style={styles.successContainer}>
        <Text style={styles.successIcon}>✓</Text>
        <Text style={styles.successTitle}>You're enrolled!</Text>
        <Text style={styles.successBody}>
          We've sent a verification email to {email.trim()}. Please check your inbox and verify your address before signing in.
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.buttonText}>Go to Sign In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- Multi-step form ---

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

        {/* Progress dots */}
        <View style={styles.progressRow} accessibilityLabel={`Step ${step} of 3`}>
          {[1, 2, 3].map(n => (
            <View key={n} style={[styles.progressDot, step >= n && styles.progressDotActive]} />
          ))}
        </View>

        <Text style={styles.stepLabel} accessibilityRole="header">
          {step === 1 ? 'Step 1 of 3 — Account' : step === 2 ? 'Step 2 of 3 — Contact' : 'Step 3 of 3 — Personal'}
        </Text>

        {/* Step 1 — Account */}
        {step === 1 && (
          <>
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>First name</Text>
                <TextInput
                  style={[styles.input, errors.first && styles.inputError]}
                  placeholder="First name"
                  value={first}
                  onChangeText={v => { setFirst(v); clearError('first'); }}
                  accessibilityLabel="First name"
                  accessibilityHint="Enter your first name"
                />
                {errors.first && <Text style={styles.errorText}>{errors.first}</Text>}
              </View>
              <View style={{ width: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Last name</Text>
                <TextInput
                  style={[styles.input, errors.last && styles.inputError]}
                  placeholder="Last name"
                  value={last}
                  onChangeText={v => { setLast(v); clearError('last'); }}
                  accessibilityLabel="Last name"
                  accessibilityHint="Enter your last name"
                />
                {errors.last && <Text style={styles.errorText}>{errors.last}</Text>}
              </View>
            </View>

            <Text style={styles.label}>Email address</Text>
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="you@example.com"
              value={email}
              onChangeText={v => { setEmail(v); clearError('email'); }}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              accessibilityLabel="Email address"
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={[styles.input, errors.password && styles.inputError]}
              placeholder="Min 8 characters"
              value={password}
              onChangeText={v => { setPassword(v); clearError('password'); }}
              secureTextEntry
              accessibilityLabel="Password"
              accessibilityHint="Minimum 8 characters with uppercase, numbers, or symbols"
            />
            {password.length > 0 && (
              <Text style={[styles.strengthText, { color: passwordStrength(password).color }]}>
                {passwordStrength(password).label}
              </Text>
            )}
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            <Text style={styles.label}>Confirm password</Text>
            <TextInput
              style={[styles.input, errors.confirmPassword && styles.inputError]}
              placeholder="Re-enter password"
              value={confirmPassword}
              onChangeText={v => { setConfirmPassword(v); clearError('confirmPassword'); }}
              secureTextEntry
              accessibilityLabel="Confirm password"
            />
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}
          </>
        )}

        {/* Step 2 — Contact */}
        {step === 2 && (
          <>
            <Text style={styles.label}>Phone number</Text>
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              placeholder="(123) 456-7890"
              value={phone}
              onChangeText={v => {
                setPhone(formatPhone(v));
                clearError('phone');
              }}
              keyboardType="phone-pad"
              accessibilityLabel="Phone number"
              accessibilityHint="Enter your 10-digit phone number"
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

            <Text style={styles.label}>Address</Text>
            <TextInput
              style={styles.input}
              placeholder="Street address"
              value={address}
              onChangeText={setAddress}
              accessibilityLabel="Street address"
            />

            <Text style={styles.label}>Apt, suite, etc. (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="Unit, suite, apt."
              value={address2}
              onChangeText={setAddress2}
              accessibilityLabel="Address line 2, optional"
            />

            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              placeholder="City"
              value={city}
              onChangeText={setCity}
              accessibilityLabel="City"
            />

            <View style={styles.row}>
              <View>
                <Text style={styles.label}>State</Text>
                <TextInput
                  style={[styles.input, styles.stateInput]}
                  placeholder="ST"
                  value={stateAbbr}
                  onChangeText={setStateAbbr}
                  autoCapitalize="characters"
                  maxLength={2}
                  accessibilityLabel="State abbreviation"
                />
              </View>
              <View style={{ width: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>ZIP code</Text>
                <TextInput
                  style={styles.input}
                  placeholder="ZIP"
                  value={zip}
                  onChangeText={setZip}
                  keyboardType="number-pad"
                  maxLength={10}
                  accessibilityLabel="ZIP code"
                />
              </View>
            </View>
          </>
        )}

        {/* Step 3 — Personal (optional) */}
        {step === 3 && (
          <>
            <Text style={styles.sectionLabel}>Birth month (optional)</Text>
            <View style={styles.chipGrid}>
              {MONTHS.map((m, i) => (
                <TouchableOpacity
                  key={m}
                  style={[styles.chip, birthMonth === i + 1 && styles.chipActive]}
                  onPress={() => setBirthMonth(birthMonth === i + 1 ? 0 : i + 1)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: birthMonth === i + 1 }}
                  accessibilityLabel={m}
                >
                  <Text style={[styles.chipText, birthMonth === i + 1 && styles.chipTextActive]}>
                    {m.slice(0, 3)}
                  </Text>
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
                  accessibilityRole="radio"
                  accessibilityState={{ selected: gender === g.value }}
                  accessibilityLabel={g.label}
                >
                  <Text style={[styles.chipText, gender === g.value && styles.chipTextActive]}>
                    {g.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Actions */}
        {step < 3 ? (
          <TouchableOpacity style={styles.button} onPress={handleNext} accessibilityRole="button" accessibilityLabel="Next step">
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
            accessibilityRole="button"
            accessibilityLabel="Create account"
            accessibilityState={{ disabled: loading }}
          >
            {loading
              ? <ActivityIndicator color="white" />
              : <Text style={styles.buttonText}>Create Account</Text>
            }
          </TouchableOpacity>
        )}

        {step > 1 && (
          <TouchableOpacity onPress={() => { setErrors({}); setStep(s => s - 1); }} accessibilityRole="button" accessibilityLabel="Go back">
            <Text style={styles.backLink}>← Back</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => navigation.navigate('Login')} accessibilityRole="link">
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
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#555',
    marginBottom: 4,
    marginTop: 2,
  },
  row: {
    flexDirection: 'row',
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 4,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#d32f2f',
  },
  errorText: {
    fontSize: 12,
    color: '#d32f2f',
    marginBottom: 8,
  },
  strengthText: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  stateInput: {
    width: 70,
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
  buttonDisabled: {
    opacity: 0.6,
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
