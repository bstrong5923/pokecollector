// firebase.js
// Initialize a Firebase app for a Vite project called Pokecollector.
// Imports
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Read config from Vite environment variables (import.meta.env.VITE_*)
const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
	measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// Safety: "npm run dev" must never talk to the live game's Firebase project.
// Put the dev project's settings in .env.development.local (see .env.development.example).
const LIVE_PROJECT_ID = "pokecollector-3d30a"
if (import.meta.env.DEV && firebaseConfig.projectId === LIVE_PROJECT_ID) {
	const message = "npm run dev is pointed at the LIVE Firebase project. Create .env.development.local with your dev project's settings (see .env.development.example), then restart npm run dev."
	try { alert(message) } catch (e) { /* ignore */ }
	throw new Error(message)
}

// Initialize Firebase
export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

