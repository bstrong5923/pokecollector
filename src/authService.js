// authService.js
// Simple wrappers around Firebase Auth for Pokecollector

import { auth } from './firebase.js'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'

/**
 * Create a new user account with email and password.
 * Returns a Promise resolving to the user credential.
 */
export async function registerUser(email, password) {
  try {
    return await createUserWithEmailAndPassword(auth, email, password)
  } catch (err) {
    console.error('registerUser error', err)
    throw err
  }
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
    return onAuthStateChanged(auth, callback)
  } catch (err) {
    console.error('onAuthChange error', err)
    return () => {}
  }
}
