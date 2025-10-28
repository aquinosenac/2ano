
const firebaseConfig = {
  apiKey: "AIzaSyBxnddI0DdTFkL0U8jko9FzL845WA88GBo",
  authDomain: "asasas-70cba.firebaseapp.com",
  projectId: "asasas-70cba",
  storageBucket: "asasas-70cba.firebasestorage.app",
  messagingSenderId: "891727406371",
  appId: "1:891727406371:web:ce3a7dbfbea9d379c3d896"
};


firebase.initializeApp(firebaseConfig);

window.auth = firebase.auth();
window.db = firebase.firestore();

console.log("✅ Firebase inicializado e auth/db disponíveis");
