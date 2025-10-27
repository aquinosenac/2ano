// ====================== CADASTRO =========================
document.getElementById("cadastroForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("cadastroEmail").value;
  const senha = document.getElementById("cadastroSenha").value;
  const confirmarSenha = document.getElementById("confirmarSenha").value;

  if (senha !== confirmarSenha) {
    alert("As senhas não conferem!");
    return;
  }

  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, senha);
    const user = userCredential.user;

    // Define cargo padrão ao criar conta
    const cargoPadrao = "usuario"; // ou defina "gerente"/"admin" manualmente

    // Salva dados do usuário no Firestore
    await db.collection("usuarios").doc(user.uid).set({
      nome: nome,
      email: email,
      cargo: cargoPadrao,
      criadoEm: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert("Cadastro realizado com sucesso!");
    window.location.href = "login.html";
  } catch (error) {
    alert("Erro ao cadastrar: " + error.message);
  }
});
// ====================== LOGIN =========================
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const senha = document.getElementById("loginSenha").value;

  try {
    const userCredential = await auth.signInWithEmailAndPassword(email, senha);
    const user = userCredential.user;

    // Busca o cargo do usuário no Firestore
    const doc = await db.collection("usuarios").doc(user.uid).get();

    if (doc.exists) {
      const cargo = doc.data().cargo;

      // Redireciona conforme o cargo
      if (cargo === "admin") {
        window.location.href = "../painel/admin.html";
      } else if (cargo === "gerente") {
        window.location.href = "../painel/gerente.html";
      } else {
        window.location.href = "../usuário.html";
      }
    } else {
      alert("Usuário sem cargo definido!");
      window.location.href = "../usuário.html";
    }

  } catch (error) {
    alert("Erro ao fazer login: " + error.message);
  }
});
