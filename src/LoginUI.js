// LoginUI.js
// Plain HTML/JS login/signup UI for Pokecollector

import { registerUser, loginUser, logoutUser, onAuthChange } from './authService.js'

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

  mount.innerHTML = ''

  const emailInput = createEl('input', { type: 'email', placeholder: 'Email', id: 'auth-email' })
  const passInput = createEl('input', { type: 'password', placeholder: 'Password', id: 'auth-pass' })
  const signUpBtn = createEl('button', { type: 'button', id: 'auth-signup' }, 'Sign Up')
  const loginBtn = createEl('button', { type: 'button', id: 'auth-login' }, 'Log In')
  const logoutBtn = createEl('button', { type: 'button', id: 'auth-logout' }, 'Log Out')
  const status = createEl('div', { id: 'auth-status', role: 'status' })
  const userInfo = createEl('div', { id: 'auth-user' })

  mount.appendChild(emailInput)
  mount.appendChild(passInput)
  mount.appendChild(signUpBtn)
  mount.appendChild(loginBtn)
  mount.appendChild(logoutBtn)
  mount.appendChild(userInfo)
  mount.appendChild(status)

  function setLoading(loading) {
    signUpBtn.disabled = loading
    loginBtn.disabled = loading
    logoutBtn.disabled = loading
  }

  async function handleSignUp() {
    setStatus(status, '')
    setLoading(true)
    try {
      const cred = await registerUser(emailInput.value, passInput.value)
      setStatus(status, `Signed up: ${cred.user.email}`)
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
    } catch (err) {
      setStatus(status, `Log in error: ${err.message || err}`, true)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    setStatus(status, '')
    setLoading(true)
    try {
      await logoutUser()
      setStatus(status, 'Logged out')
    } catch (err) {
      setStatus(status, `Log out error: ${err.message || err}`, true)
    } finally {
      setLoading(false)
    }
  }

  signUpBtn.addEventListener('click', handleSignUp)
  loginBtn.addEventListener('click', handleLogin)
  logoutBtn.addEventListener('click', handleLogout)

  // Allow Enter to submit when focused in inputs
  [emailInput, passInput].forEach((inp) =>
    inp.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleLogin()
    })
  )

  // React to auth changes: show/hide buttons and display user email
  onAuthChange((user) => {
    if (user) {
      emailInput.style.display = 'none'
      passInput.style.display = 'none'
      signUpBtn.style.display = 'none'
      loginBtn.style.display = 'none'
      logoutBtn.style.display = ''
      userInfo.textContent = `Signed in as ${user.email}`
    } else {
      emailInput.style.display = ''
      passInput.style.display = ''
      signUpBtn.style.display = ''
      loginBtn.style.display = ''
      logoutBtn.style.display = 'none'
      userInfo.textContent = ''
    }
  })

  // Initial state
  logoutBtn.style.display = 'none'
}
