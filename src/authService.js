// authService.js
// Simple wrappers around Firebase Auth for Pokecollector

import { auth } from './firebase.js'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth'

/**
 * Create a new user account with email and password.
 * Returns a Promise resolving to the user credential.
 */
export async function registerUser(email, password, username) {
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    try {
      if (username && cred.user) {
        await updateProfile(cred.user, { displayName: username })
        // (the username is saved to the player document with the first game save after verification)
      }
    } catch (e) {
      console.warn('updateProfile failed', e)
    }
    // send verification email if possible
    try {
      if (cred.user) await sendEmailVerification(cred.user)
    } catch (e) {
      console.warn('sendEmailVerification failed', e)
    }
    return cred
  } catch (err) {
    console.error('registerUser error', err)
    throw err
  }
}

export async function sendVerificationEmail(user) {
  try {
    if (!user) throw new Error('no user provided')
    return await sendEmailVerification(user)
  } catch (err) {
    console.error('sendVerificationEmail error', err)
    throw err
  }
}

/**
 * Call this after the user's email is confirmed verified (after user.reload()).
 * Every onAuthChange listener is called again with the now-verified user.
 */
export async function announceVerified() {
  // refresh the login token so it carries email_verified = true (the Firestore rules check it)
  try {
    if (auth.currentUser) await auth.currentUser.getIdToken(true)
  } catch (e) {
    console.warn('token refresh failed', e)
  }
  window.dispatchEvent(new Event('pco-verified'))
}

/**
 * Sign in an existing user with email and password.
 * Returns a Promise resolving to the user credential.
 */
export async function loginUser(email, password) {
  try {
    return await signInWithEmailAndPassword(auth, email, password)
  } catch (err) {
    console.error('loginUser error', err)
    throw err
  }
}

/**
 * Sign out the current user.
 * Returns a Promise that resolves when sign-out completes.
 */
export async function logoutUser() {
  try {
    return await signOut(auth)
  } catch (err) {
    console.error('logoutUser error', err)
    throw err
  }
}

/**
 * Register a callback to be invoked on auth state changes.
 * The callback receives the `user` object or `null`.
 * Returns the unsubscribe function.
 */
export function onAuthChange(callback) {
  try {
    const unsubscribe = onAuthStateChanged(auth, callback)
    // Firebase does not fire an auth event when an email gets verified,
    // so announceVerified() tells every listener to re-check the current user
    const onVerified = () => callback(auth.currentUser)
    window.addEventListener('pco-verified', onVerified)
    return () => {
      unsubscribe()
      window.removeEventListener('pco-verified', onVerified)
    }
  } catch (err) {
    console.error('onAuthChange error', err)
    return () => {}
  }
}
