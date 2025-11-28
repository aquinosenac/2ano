// auth.js
// Depende de firebase.js (window.firebaseApi)

const CURRENT_USER_KEY = 'ecommerce_current_user';

function saveLocalUser(userObj) {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userObj));
}

function clearLocalUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

function getLocalUser() {
  const s = localStorage.getItem(CURRENT_USER_KEY);
  return s ? JSON.parse(s) : null;
}

// Observador de autenticação
if (window.firebaseApi && firebaseApi.auth) {
  firebaseApi.auth.onAuthStateChanged(async (user) => {
    if (user) {
      const role = await firebaseApi.getRole(user.uid);
      // tenta buscar profile
      const profile = await firebaseApi.getUserProfile(user.uid);
      const u = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || (profile && profile.displayName) || '',
        role: role || null
      };
      saveLocalUser(u);
      // opcional: se houver função updateUIForUser na page, chama
      if (typeof updateUIForUser === 'function') updateUIForUser(u);
    } else {
      clearLocalUser();
      if (typeof updateUIForUser === 'function') updateUIForUser(null);
    }
  });
}

// Funções expostas para usar nas páginas
async function handleSignIn(email, password) {
  try {
    await firebaseApi.signInWithEmail(email, password);
    // onAuthStateChanged setará localStorage
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err.message || String(err) };
  }
}

async function handleSignUp(name, email, password) {
  try {
    const cred = await firebaseApi.signUpWithEmail(email, password, name);
    // Note: role não é atribuído automaticamente
    return { ok: true, uid: cred.user.uid };
  } catch (err) {
    return { ok: false, error: err.message || String(err) };
  }
}

async function handleSignOut() {
  await firebaseApi.signOut();
  clearLocalUser();
}

// requireRole: verifica localStorage — se ainda não tiver role pode aguardar onAuthState para popular
async function requireRole(allowedRoles = []) {
  const current = getLocalUser();
  if (!current) {
    window.location.href = 'login.html';
    return false;
  }
  // se role ainda for null, tenta obter do server
  if (!current.role) {
    const role = await firebaseApi.getRole(current.uid);
    current.role = role;
    saveLocalUser(current);
  }
  if (allowedRoles.length && !allowedRoles.includes(current.role)) {
    window.location.href = 'unauthorized.html';
    return false;
  }
  return true;
}

function getCurrentUser() {
  return getLocalUser();
}

window.appAuth = {
  handleSignIn,
  handleSignUp,
  handleSignOut,
  requireRole,
  getCurrentUser
};
