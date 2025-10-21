// script.js

// Cadastro
document.addEventListener("DOMContentLoaded", () => {
  const cadastroForm = document.getElementById("cadastroForm");
  const loginForm = document.getElementById("loginForm");

  if (cadastroForm) {
    cadastroForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("cadastroEmail").value;
      const senha = document.getElementById("cadastroSenha").value;
      const confirmar = document.getElementById("confirmarSenha").value;

      if (senha !== confirmar) {
        alert("As senhas não coincidem!");
        return;
      }

      firebase.auth().createUserWithEmailAndPassword(email, senha)
        .then((userCredential) => {
          alert("Usuário cadastrado com sucesso!");
          window.location.href = "/projetoagendamento/salas-horarios.html"; 
        })
        .catch((error) => {
          alert("Erro no cadastro: " + error.message);
        });
    });
  }

  // Login
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const senha = document.getElementById("loginSenha").value;

      firebase.auth().signInWithEmailAndPassword(email, senha)
        .then((userCredential) => {
          alert("Login realizado com sucesso!");
          // Redirecionar para painel, dashboard, etc
          window.location.href = "dashboard.html"; // substitua pela sua página
        })
        .catch((error) => {
          alert("Erro no login: " + error.message);
        });
    });
  }
});
