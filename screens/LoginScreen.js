import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { useAuth } from '../AuthContext';
import { recordError } from '../crashlytics';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleAuth = async () => {
    const errs = {};
    if (!email.trim()) errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errs.email = 'Enter a valid email address.';
    if (!password) errs.password = 'Password is required.';
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      recordError(err);
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.kav} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />

          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="Email address"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={v => { setEmail(v); setErrors(e => ({ ...e, email: undefined })); }}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          <View style={[styles.passwordRow, errors.password && styles.inputError]}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor="#9ca3af"
              value={password}
              onChangeText={v => { setPassword(v); setErrors(e => ({ ...e, password: undefined })); }}
              secureTextEntry={!showPassword}
              autoComplete="current-password"
            />
            <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeButton}>
              <Text style={styles.eyeText}>{showPassword ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <TouchableOpacity style={styles.button} onPress={handleAuth} disabled={loading}>
            {loading
              ? <ActivityIndicator color="white" />
              : <Text style={styles.buttonText}>Sign In</Text>
            }
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
            <Text style={styles.toggle}>Forgot your password?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Enrollment')}>
            <Text style={styles.toggle}>Don't have an account? Register</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  kav: { flex: 1, backgroundColor: '#f4f6f9' },
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 32, width: '100%', maxWidth: 420, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  logo: { width: 200, height: 80, alignSelf: 'center', marginBottom: 24 },
  input: { borderWidth: 1.5, borderColor: '#e0e0e0', borderRadius: 8, padding: 12, marginBottom: 4, fontSize: 16 },
  inputError: { borderColor: '#d32f2f' },
  errorText: { fontSize: 12, color: '#d32f2f', marginBottom: 10, marginTop: 0 },
  passwordRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#e0e0e0', borderRadius: 8, marginBottom: 4 },
  passwordInput: { flex: 1, padding: 12, fontSize: 16 },
  eyeButton: { paddingHorizontal: 12 },
  eyeText: { color: '#1a73e8', fontSize: 13, fontWeight: '600' },
  button: { backgroundColor: '#1a73e8', borderRadius: 8, padding: 14, alignItems: 'center', marginBottom: 12 },
  buttonText: { color: 'white', fontWeight: '600', fontSize: 16 },
  toggle: { color: '#1a73e8', textAlign: 'center', fontSize: 14 },
});
