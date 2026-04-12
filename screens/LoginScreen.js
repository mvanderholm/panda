import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, Image } from 'react-native';
import { useAuth } from '../AuthContext';

// --- Firebase (disabled) ---
// import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
// import { auth } from '../firebase';
// ---------------------------

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // const [isRegistering, setIsRegistering] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }

    // --- Firebase (disabled) ---
    // try {
    //   if (isRegistering) {
    //     await createUserWithEmailAndPassword(auth, email, password);
    //   } else {
    //     await signInWithEmailAndPassword(auth, email, password);
    //   }
    // } catch (err) {
    //   Alert.alert('Error', err.message.replace('Firebase: ', ''));
    // }
    // ---------------------------
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />

        <TextInput
          style={styles.input}
          placeholder="Email address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

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

        {/* --- Firebase register toggle (disabled) ---
        <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
          <Text style={styles.toggle}>
            {isRegistering ? 'Already have an account? Sign in' : "Don't have an account? Register"}
          </Text>
        </TouchableOpacity>
        */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f6f9', justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 32, width: '100%', maxWidth: 380, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  logo: { width: 200, height: 80, alignSelf: 'center', marginBottom: 24 },
  input: { borderWidth: 1.5, borderColor: '#e0e0e0', borderRadius: 8, padding: 12, marginBottom: 12, fontSize: 16 },
  button: { backgroundColor: '#1a73e8', borderRadius: 8, padding: 14, alignItems: 'center', marginBottom: 12 },
  buttonText: { color: 'white', fontWeight: '600', fontSize: 16 },
  toggle: { color: '#1a73e8', textAlign: 'center', fontSize: 14 },
});
