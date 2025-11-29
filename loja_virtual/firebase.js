// firebase.js
// NÃO USE import aqui. Esse arquivo usa Firebase COMPAT.

const firebaseConfig = {
  apiKey: "AIzaSyCbILRjB0Agf1UsmZ3eaFUIjzCBrG4GBIs",
  authDomain: "lojavirtual-b8b24.firebaseapp.com",
  projectId: "lojavirtual-b8b24",
  storageBucket: "lojavirtual-b8b24.firebasestorage.app",
  messagingSenderId: "993521503752",
  appId: "1:993521503752:web:01cfba42f5f1b9b7110bbd",
  measurementId: "G-WBZCY6HMGS"
};

// Inicializa Firebase (compat)
if (!window._firebaseInitialized) {
  firebase.initializeApp(firebaseConfig);
  window._firebaseInitialized = true;

  window.firebaseAuth = firebase.auth();
  window.firebaseDb = firebase.firestore();
}

// --- Auth helpers ---
async function signInWithEmail(email, password) {
  return firebaseAuth.signInWithEmailAndPassword(email, password);
}

async function signUpWithEmail(email, password, displayName) {
  const cred = await firebaseAuth.createUserWithEmailAndPassword(email, password);

  if (displayName) {
    await cred.user.updateProfile({ displayName });
  }

  await firebaseDb.collection('users').doc(cred.user.uid).set({
    displayName: displayName || '',
    email: email,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  return cred;
}

async function signOut() {
  return firebaseAuth.signOut();
}

// Roles
async function getRole(uid) {
  if (!uid) return null;
  const doc = await firebaseDb.collection('roles').doc(uid).get();
  return doc.exists ? doc.data().role : "usuario";
}

async function setRole(uid, role) {
  return firebaseDb.collection('roles').doc(uid).set({ role });
}

// Users
async function getUserProfile(uid) {
  const doc = await firebaseDb.collection('users').doc(uid).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
}

async function updateUserProfile(uid, data) {
  return firebaseDb.collection('users').doc(uid).update(data);
}

async function listUserProfiles() {
  const snap = await firebaseDb.collection('users').orderBy('createdAt', 'desc').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Products (CRUD)
async function addProductFirestore(product) {
  const ref = await firebaseDb.collection('products').add({
    ...product,
    price: Number(product.price),
    stock: Number(product.stock),
    featured: !!product.featured,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  const doc = await ref.get();
  return { id: ref.id, ...doc.data() };
}

async function updateProductFirestore(id, product) {
  await firebaseDb.collection('products').doc(id).update({
    ...product,
    price: Number(product.price),
    stock: Number(product.stock),
    featured: !!product.featured,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
  });
  const doc = await firebaseDb.collection('products').doc(id).get();
  return { id: doc.id, ...doc.data() };
}

async function deleteProductFirestore(id) {
  return firebaseDb.collection('products').doc(id).delete();
}

async function getProductByIdFirestore(id) {
  const doc = await firebaseDb.collection('products').doc(id).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
}

async function listProductsFirestore() {
  const snap = await firebaseDb.collection('products').orderBy('createdAt', 'desc').get();
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Export
window.firebaseApi = {
  auth: firebaseAuth,
  db: firebaseDb,

  signInWithEmail,
  signUpWithEmail,
  signOut,

  getRole,
  setRole,
  getUserProfile,
  updateUserProfile,
  listUserProfiles,

  addProductFirestore,
  updateProductFirestore,
  deleteProductFirestore,
  getProductByIdFirestore,
  listProductsFirestore
};
