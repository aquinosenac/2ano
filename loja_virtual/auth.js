// auth.js

function saveUserLocal(user, role) {
  localStorage.setItem("ecommerce_current_user", JSON.stringify({
    uid: user.uid,
    email: user.email,
    role: role
  }));
}

function getCurrentUser() {
  const data = localStorage.getItem("ecommerce_current_user");
  return data ? JSON.parse(data) : null;
}

function logout() {
  firebaseApi.signOut().then(() => {
    localStorage.removeItem("ecommerce_current_user");
    window.location.href = "login.html";
  });
}

window.appAuth = {
  saveUserLocal,
  getCurrentUser,
  logout
};
