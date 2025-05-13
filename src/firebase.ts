// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyAwqoVbyHPaJCKc_wPDQizAqr5ofbECeHA',
  authDomain: 'sharedshoppinglist-53f31.firebaseapp.com',
  projectId: 'sharedshoppinglist-53f31',
  storageBucket: 'sharedshoppinglist-53f31.firebasestorage.app',
  messagingSenderId: '735414847687',
  appId: '1:735414847687:web:39ead113ec3c15f2ae16e2',
  measurementId: 'G-VQRWTBF3M4',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)

const db = getFirestore(app)
const auth = getAuth(app)
const googleProvider = new GoogleAuthProvider()

export { db, auth, googleProvider, analytics }
