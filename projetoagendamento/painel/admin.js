const auth = firebase.auth();
const db = firebase.firestore();

// logout
document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  await auth.signOut();
  window.location.href = "../login-cadastro/login.html";
});

// verifica login e permissão
auth.onAuthStateChanged(async (user) => {
  if (!user) {
    window.location.href = "../login-cadastro/login.html";
    return;
  }

  const userDoc = await db.collection("usuarios").doc(user.uid).get();
  const cargo = userDoc.data()?.cargo;

  if (cargo !== "admin") {
    alert("Acesso negado!");
    window.location.href = "../usuário.html";
    return;
  }

  carregarUsuarios();
});

// carrega lista de usuários
async function carregarUsuarios() {
  const tabela = document.getElementById("tabelaUsuarios");
  tabela.innerHTML = "<tr><td colspan='4'>Carregando...</td></tr>";

  const snapshot = await db.collection("usuarios").get();
  tabela.innerHTML = "";

  snapshot.forEach(doc => {
    const u = doc.data();
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${u.nome || "-"}</td>
      <td>${u.email}</td>
      <td>
        <select data-id="${doc.id}" class="selectCargo">
          <option value="usuario" ${u.cargo === "usuario" ? "selected" : ""}>Usuário</option>
          <option value="gerente" ${u.cargo === "gerente" ? "selected" : ""}>Gerente</option>
          <option value="admin" ${u.cargo === "admin" ? "selected" : ""}>Administrador</option>
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

function ativarEventosTabela() {
  document.querySelectorAll(".btnSalvar").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      const novoCargo = document.querySelector(`.selectCargo[data-id="${id}"]`).value;
      await db.collection("usuarios").doc(id).update({ cargo: novoCargo });
      alert("Cargo atualizado!");
    });
  });

  document.querySelectorAll(".btnExcluir").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;
      if (confirm("Excluir este usuário?")) {
        await db.collection("usuarios").doc(id).delete();
        alert("Usuário removido!");
        carregarUsuarios();
      }
    });
  });
}
