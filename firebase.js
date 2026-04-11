import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBGG_flzAjsF54Dj4b0dTbOWCs9DTlB5gU",
  authDomain: "panda-mcv.firebaseapp.com",
  projectId: "panda-mcv",
  storageBucket: "panda-mcv.firebasestorage.app",
  messagingSenderId: "806867445947",
  appId: "1:806867445947:web:62ca83ac773aa809b1a19e",
  measurementId: "G-H1G90FCGPJ"
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});