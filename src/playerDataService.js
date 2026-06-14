// playerDataService.js
// Firestore helpers to save/load player collections for Pokecollector

import { db } from './firebase.js'
import { doc, setDoc, getDoc } from 'firebase/firestore'

/**
 * Save player data under `players/{userId}`.
 * Uses merge to avoid overwriting other fields.
 * Returns the Promise from setDoc.
 */
export async function savePlayerData(userId, data) {
  try {
    const ref = doc(db, 'players', userId)
    return await setDoc(ref, data, { merge: true })
  } catch (err) {
    console.error('savePlayerData error', err)
    throw err
  }
}

/**
 * Load player data from `players/{userId}`.
 * Returns the document data object or null if not found.
 */
export async function loadPlayerData(userId) {
  try {
    const ref = doc(db, 'players', userId)
    const snap = await getDoc(ref)
    if (!snap.exists()) return null
    return snap.data()
  } catch (err) {
    console.error('loadPlayerData error', err)
    throw err
  }
}
