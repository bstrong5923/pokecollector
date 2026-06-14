// LoginUI.js
// Plain HTML/JS login/signup UI for Pokecollector

import { registerUser, loginUser, logoutUser, onAuthChange } from './authService.js'
import { auth } from './firebase.js'

function createEl(tag, attrs = {}, text) {
  const el = document.createElement(tag)
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v))
  if (text !== undefined) el.textContent = text
  return el
}

function setStatus(el, msg, isError = false) {
  el.textContent = msg || ''
  el.style.color = isError ? 'crimson' : 'green'
}

export function initLoginUI() {
  const mount = document.getElementById('auth-ui')
  if (!mount) {
    console.error('initLoginUI: no element with id "auth-ui" found')
    return
  }

  // build a centered modal inside the mount element
  mount.innerHTML = ''
  const overlay = createEl('div', { id: 'auth-modal' })
  Object.assign(overlay.style, {
    position: 'fixed',
    left: '0',
    top: '0',
    width: '100%',
    height: '100%',
    display: 'none',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0,0,0,0.6)',
    zIndex: '9999',
    boxSizing: 'border-box',
  })

  const box = createEl('div', { id: 'auth-modal-box' })
  Object.assign(box.style, {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    minWidth: '320px',
    boxSizing: 'border-box',
    textAlign: 'center',
    fontFamily: 'pkmn, sans-serif',
    color: '#111'
  })

  const title = createEl('h2', {}, 'Pokecollector — Sign In')
  title.style.marginTop = '0'

  const emailInput = createEl('input', { type: 'email', placeholder: 'Email', id: 'auth-email' })
  const passInput = createEl('input', { type: 'password', placeholder: 'Password', id: 'auth-pass' })
  const signUpBtn = createEl('button', { type: 'button', id: 'auth-signup' }, 'Sign Up')
  const loginBtn = createEl('button', { type: 'button', id: 'auth-login' }, 'Log In')
  const status = createEl('div', { id: 'auth-status', role: 'status' })
  const userInfo = createEl('div', { id: 'auth-user' })

  Object.assign(emailInput.style, { width: '100%', margin: '8px 0', padding: '8px' })
  Object.assign(passInput.style, { width: '100%', margin: '8px 0', padding: '8px' })
  Object.assign(signUpBtn.style, { marginRight: '8px', padding: '8px 12px' })
  Object.assign(loginBtn.style, { padding: '8px 12px' })
  Object.assign(status.style, { marginTop: '8px', minHeight: '18px' })

  const actions = createEl('div')
  actions.appendChild(signUpBtn)
  actions.appendChild(loginBtn)

  box.appendChild(title)
  box.appendChild(emailInput)
  box.appendChild(passInput)
  box.appendChild(actions)
  box.appendChild(userInfo)
  box.appendChild(status)
  overlay.appendChild(box)
  mount.appendChild(overlay)

  function setLoading(loading) {
    signUpBtn.disabled = loading
    loginBtn.disabled = loading
  }

  // Defensive checks: ensure elements were created
  if (!emailInput || !passInput || !signUpBtn || !loginBtn || !status) {
    console.error('initLoginUI: failed to create auth UI elements', { emailInput, passInput, signUpBtn, loginBtn, status })
    return
  }

  async function handleSignUp() {
    setStatus(status, '')
    setLoading(true)
    try {
      const cred = await registerUser(emailInput.value, passInput.value)
      setStatus(status, `Signed up: ${cred.user.email}`)
      // hide modal immediately after successful signup
      overlay.style.display = 'none'
    } catch (err) {
      setStatus(status, `Sign up error: ${err.message || err}`, true)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogin() {
    setStatus(status, '')
    setLoading(true)
    try {
      const cred = await loginUser(emailInput.value, passInput.value)
      setStatus(status, `Logged in: ${cred.user.email}`)
      // hide modal immediately after successful login
      overlay.style.display = 'none'
    } catch (err) {
      setStatus(status, `Log in error: ${err.message || err}`, true)
    } finally {
      setLoading(false)
    }
  }

  signUpBtn.addEventListener('click', handleSignUp)
  loginBtn.addEventListener('click', handleLogin)

  // Allow Enter to submit when focused in inputs
  try {
    [emailInput, passInput].forEach((inp) => {
      if (inp && typeof inp.addEventListener === 'function') {
        inp.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') handleLogin()
        })
      }
    })
  } catch (e) {
    console.warn('initLoginUI: failed to attach keydown listeners', e)
  }

  // React to auth changes: show/hide the modal and display user email
  onAuthChange((user) => {
    if (user) {
      overlay.style.display = 'none'
      userInfo.textContent = `Signed in as ${user.email}`
    } else {
      overlay.style.display = 'flex'
      userInfo.textContent = ''
    }
  })

  // If auth already has a current user (e.g. auth state fired before this listener attached), hide modal
  try {
    if (auth) {
      if (auth.currentUser) {
        overlay.style.display = 'none'
        userInfo.textContent = `Signed in as ${auth.currentUser.email}`
      } else {
        // no current user — show the modal
        overlay.style.display = 'flex'
        userInfo.textContent = ''
      }
    }
  } catch (e) {
    // ignore
  }
}
