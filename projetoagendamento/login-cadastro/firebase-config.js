// Configuração do Firebase (copie do console do Firebase)
const firebaseConfig = {
  apiKey: "xxxxx",
  authDomain: "xxxxx.firebaseapp.com",
  projectId: "xxxxx",
  storageBucket: "xxxxx.appspot.com",
  messagingSenderId: "xxxxx",
  appId: "xxxxx"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

// Cria variáveis globais (IMPORTANTE!)
window.auth = firebase.auth();
window.db = firebase.firestore();
