import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

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
export const auth = getAuth(app);