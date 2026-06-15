// LoginUI.js
// Plain HTML/JS login/signup UI for Pokecollector

import { registerUser, loginUser, logoutUser, onAuthChange, sendVerificationEmail } from './authService.js'
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
    background: '#0f1720',
    padding: '20px',
    borderRadius: '8px',
    minWidth: '320px',
    boxSizing: 'border-box',
    textAlign: 'center',
    fontFamily: 'pkmn, sans-serif',
    color: '#fff',
    boxShadow: '0 6px 24px rgba(0,0,0,0.6)'
  })

  const title = createEl('h2', {}, 'Pokecollector — Sign In')
  title.style.marginTop = '0'

  const emailInput = createEl('input', { type: 'email', placeholder: 'Email', id: 'auth-email' })
  const usernameInput = createEl('input', { type: 'text', placeholder: 'Username', id: 'auth-username' })
  const passInput = createEl('input', { type: 'password', placeholder: 'Password', id: 'auth-pass' })
  const signUpBtn = createEl('button', { type: 'button', id: 'auth-signup' }, 'Sign Up')
  const loginBtn = createEl('button', { type: 'button', id: 'auth-login' }, 'Log In')
  const status = createEl('div', { id: 'auth-status', role: 'status' })
  const userInfo = createEl('div', { id: 'auth-user' })

  const inputCommon = { width: '100%', margin: '8px 0', padding: '8px', background: '#111827', color: '#fff', border: '1px solid #374151', borderRadius: '4px' }
  Object.assign(emailInput.style, inputCommon)
  Object.assign(usernameInput.style, inputCommon)
  Object.assign(passInput.style, inputCommon)
  Object.assign(signUpBtn.style, { marginRight: '8px', padding: '8px 12px', background: '#b91c1c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' })
  Object.assign(loginBtn.style, { padding: '8px 12px', background: '#059669', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' })
  Object.assign(status.style, { marginTop: '8px', minHeight: '18px' })

  const actions = createEl('div')
  actions.appendChild(signUpBtn)
  actions.appendChild(loginBtn)
  Object.assign(actions.style, { marginTop: '8px', marginBottom: '12px' })

  box.appendChild(title)
  box.appendChild(usernameInput)
  const usernameHelp = createEl('div', {}, 'not necessary for Log In')
  Object.assign(usernameHelp.style, { color: '#ff6b6b', fontSize: '12px', marginTop: '-4px', marginBottom: '8px' })
  box.appendChild(usernameHelp)
  box.appendChild(emailInput)
  box.appendChild(passInput)
  box.appendChild(actions)
  Object.assign(userInfo.style, { marginTop: '14px', color: '#9ca3af', fontSize: '14px' })
  box.appendChild(userInfo)
  Object.assign(status.style, { marginTop: '12px', minHeight: '18px' })
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

  // verification monitor state
  let verifyInterval = null
  let verifyControls = null

  function clearVerifyMonitor() {
    if (verifyInterval) {
      clearInterval(verifyInterval)
      verifyInterval = null
    }
    if (verifyControls) {
      try { verifyControls.remove() } catch (e) {}
      verifyControls = null
    }
  }

  async function startVerificationMonitor(user) {
    clearVerifyMonitor()
    if (!user) return
    verifyControls = createEl('div')
    Object.assign(verifyControls.style, { marginTop: '12px', display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' })

    // spam note
    const spamNote = createEl('div', {}, "If you don't see the email, check your spam/junk folder.")
    Object.assign(spamNote.style, { width: '100%', textAlign: 'center', color: '#ffb4b4', fontSize: '12px', marginTop: '8px' })
    box.appendChild(spamNote)

    const checkBtn = createEl('button', {}, 'I Verified (Check)')
    const resendBtn = createEl('button', {}, 'Resend Email')
    const signoutBtn = createEl('button', {}, 'Cancel')
    Object.assign(checkBtn.style, { padding: '6px 10px', cursor: 'pointer', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px' })
    Object.assign(resendBtn.style, { padding: '6px 10px', cursor: 'pointer', background: '#b91c1c', color: '#fff', border: 'none', borderRadius: '4px' })
    Object.assign(signoutBtn.style, { padding: '6px 10px', cursor: 'pointer', background: '#6b7280', color: '#fff', border: 'none', borderRadius: '4px' })

    verifyControls.appendChild(checkBtn)
    verifyControls.appendChild(resendBtn)
    verifyControls.appendChild(signoutBtn)
    box.appendChild(verifyControls)

    checkBtn.addEventListener('click', async () => {
      try {
        await user.reload()
        const fresh = auth.currentUser || user
        if (fresh && fresh.emailVerified) {
          setStatus(status, 'Email verified — welcome!')
          clearVerifyMonitor()
          overlay.style.display = 'none'
        } else {
          setStatus(status, 'Still not verified — check your inbox', true)
        }
      } catch (e) {
        console.warn('verification check failed', e)
      }
    })

    resendBtn.addEventListener('click', async () => {
      try {
        await sendVerificationEmail(user)
        setStatus(status, 'Verification email resent')
      } catch (e) {
        setStatus(status, 'Resend failed', true)
      }
    })

    signoutBtn.addEventListener('click', async () => {
      try { await logoutUser() } catch (e) { console.warn(e) }
      clearVerifyMonitor()
      overlay.style.display = 'flex'
      setStatus(status, '')
    })

    // start polling every 3s
    verifyInterval = setInterval(async () => {
      try {
        await user.reload()
        const fresh = auth.currentUser || user
        if (fresh && fresh.emailVerified) {
          setStatus(status, 'Email verified — welcome!')
          clearVerifyMonitor()
          overlay.style.display = 'none'
        }
      } catch (e) {
        console.warn('verification poll error', e)
      }
    }, 3000)
  }

  async function handleSignUp() {
    setStatus(status, '')
    setLoading(true)
    try {
      const username = (usernameInput && usernameInput.value || '').trim()
      if (!username) {
        setStatus(status, 'Please enter a username', true)
        setLoading(false)
        return
      }
      const cred = await registerUser(emailInput.value, passInput.value, username)
      setStatus(status, `Signed up: ${cred.user.email}. Verification email sent.`)
      overlay.style.display = 'flex'
      // start monitoring verification
      startVerificationMonitor(cred.user)
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
      // if email not verified, block until verification
      const user = cred.user || auth.currentUser
      if (user && !user.emailVerified) {
        setStatus(status, 'Account not verified. Verification email sent previously. Please verify to continue.', true)
        overlay.style.display = 'flex'
        startVerificationMonitor(user)
      } else {
        overlay.style.display = 'none'
      }
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
    [usernameInput, emailInput, passInput].forEach((inp) => {
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
