// ================= FIREBASE CONFIG ==================
const auth = firebase.auth();
const db = firebase.firestore();

// ================= LOGOUT ==================
document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  await auth.signOut();
  window.location.href = "../login-cadastro/login.html";
});

// ================= VERIFICA LOGIN ==================
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "../login-cadastro/login.html";
    return;
  }

  const doc = await db.collection("usuarios").doc(user.uid).get();
  if (!doc.exists || doc.data().cargo !== "admin") {
    alert("Acesso negado! Apenas administradores podem entrar aqui.");
    window.location.href = "../usuário.html";
    return;
  }

  carregarUsuarios();
});

// ================= CARREGAR USUÁRIOS ==================
async function carregarUsuarios() {
  const tabela = document.getElementById("tabelaUsuarios");
  tabela.innerHTML = "<tr><td colspan='4'>Carregando...</td></tr>";

  const snapshot = await db.collection("usuarios").get();
  tabela.innerHTML = "";

  snapshot.forEach(doc => {
    const usuario = doc.data();

    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${usuario.nome || "-"}</td>
      <td>${usuario.email}</td>
      <td>
        <select class="selectCargo" data-id="${doc.id}">
          <option value="usuario" ${usuario.cargo === "usuario" ? "selected" : ""}>Usuário</option>
          <option value="gerente" ${usuario.cargo === "gerente" ? "selected" : ""}>Gerente</option>
          <option value="admin" ${usuario.cargo === "admin" ? "selected" : ""}>Administrador</option>
        </select>
      </td>
      <td>
        <button class="btn-cta btnSalvar" data-id="${doc.id}">Salvar</button>
        <button class="btn-cta btnExcluir" data-id="${doc.id}" style="background:#c0392b">Excluir</button>
      </td>
    `;
    tabela.appendChild(linha);
  });

  ativarEventosTabela();
}

// ================= EVENTOS DOS BOTÕES ==================
function ativarEventosTabela() {
  // salvar cargo
  document.querySelectorAll(".btnSalvar").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.getAttribute("data-id");
      const novoCargo = document.querySelector(`.selectCargo[data-id="${id}"]`).value;

      await db.collection("usuarios").doc(id).update({ cargo: novoCargo });
      alert("Cargo atualizado com sucesso!");
    });
  });

  // excluir usuário
  document.querySelectorAll(".btnExcluir").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.getAttribute("data-id");
      const confirmar = confirm("Tem certeza que deseja remover este usuário?");
      if (!confirmar) return;

      await db.collection("usuarios").doc(id).delete();
      alert("Usuário removido com sucesso!");
      carregarUsuarios();
    });
  });
}
