// js/storage.js (atualizado)
// Mantém carrinho no localStorage + notificações + cart count

const CART_KEY = 'ecommerce_cart';
const CURRENT_USER_KEY = 'ecommerce_current_user';

// Carrinho
function getCart() {
  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function addToCart(product) {
  // product: { id, name, price, image, stock }
  const cart = getCart();
  const item = cart.find(i => i.id === product.id);
  if (item) {
    item.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  saveCart(cart);
  showNotification('Produto adicionado ao carrinho!', 'success');
}

function updateCartQuantity(id, quantity) {
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  if (quantity <= 0) {
    removeFromCart(id);
  } else {
    item.quantity = quantity;
    saveCart(cart);
  }
}

function removeFromCart(id) {
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
  showNotification('Produto removido do carrinho', 'info');
}

function clearCart() {
  saveCart([]);
  showNotification('Carrinho limpo com sucesso', 'success');
}

function getCartTotal() {
  const cart = getCart();
  return cart.reduce((s, i) => s + i.price * i.quantity, 0);
}

function getCartCount() {
  const cart = getCart();
  return cart.reduce((s, i) => s + i.quantity, 0);
}

function updateCartCount() {
  const cartBadge = document.querySelector('.cart-badge');
  if (!cartBadge) return;
  const n = getCartCount();
  if (n > 0) {
    cartBadge.textContent = n;
    cartBadge.style.display = 'flex';
  } else {
    cartBadge.style.display = 'none';
  }
}

// Notificações (mesma implementação)
function showNotification(message, type = 'info') {
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#43a047' : type === 'danger' ? '#e53935' : '#1e88e5'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;
  document.body.appendChild(notification);
  setTimeout(() => { notification.style.animation = 'slideOut 0.3s ease'; setTimeout(()=>notification.remove(),300); }, 3000);
}

// estilo das animações (se já existir, não duplica muito)
if (!document.getElementById('notifStyle')) {
  const style = document.createElement('style');
  style.id = 'notifStyle';
  style.textContent = `
    @keyframes slideIn { from { transform: translateX(400px); opacity:0 } to { transform: translateX(0); opacity:1 } }
    @keyframes slideOut { from { transform: translateX(0); opacity:1 } to { transform: translateX(400px); opacity:0 } }
  `;
  document.head.appendChild(style);
}

// Usuário atual (compat)
function getCurrentUser() {
  const s = localStorage.getItem(CURRENT_USER_KEY);
  return s ? JSON.parse(s) : null;
}

function isLoggedIn() {
  return getCurrentUser() !== null;
}

// Atualiza duração do badge ao carregar cada página
document.addEventListener('DOMContentLoaded', updateCartCount);
