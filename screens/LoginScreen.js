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

  const handleAuth = async () => {
    setLoading(true);
    try {
      await login(email, password);
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
            style={styles.input}
            placeholder="Email address"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <View style={styles.passwordRow}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Password"
              placeholderTextColor="#9ca3af"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(v => !v)} style={styles.eyeButton}>
              <Text style={styles.eyeText}>{showPassword ? 'Hide' : 'Show'}</Text>
            </TouchableOpacity>
          </View>

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
  input: { borderWidth: 1.5, borderColor: '#e0e0e0', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 16 },
  passwordRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor: '#e0e0e0', borderRadius: 8, marginBottom: 12 },
  passwordInput: { flex: 1, padding: 12, fontSize: 16 },
  eyeButton: { paddingHorizontal: 12 },
  eyeText: { color: '#1a73e8', fontSize: 13, fontWeight: '600' },
  button: { backgroundColor: '#1a73e8', borderRadius: 8, padding: 14, alignItems: 'center', marginBottom: 12 },
  buttonText: { color: 'white', fontWeight: '600', fontSize: 16 },
  toggle: { color: '#1a73e8', textAlign: 'center', fontSize: 14 },
});
