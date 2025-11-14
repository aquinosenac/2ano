// Sistema de armazenamento usando localStorage

const PRODUCTS_KEY = 'ecommerce_products';
const CART_KEY = 'ecommerce_cart';
const USERS_KEY = 'ecommerce_users';
const CURRENT_USER_KEY = 'ecommerce_current_user';

// Produtos iniciais para demonstração
const initialProducts = [
  {
    id: '1',
    name: 'Notebook Gamer Pro',
    description: 'Notebook de alta performance com processador Intel i7, 16GB RAM e RTX 3060',
    price: 5499.99,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500',
    category: 'Eletrônicos',
    stock: 15,
    featured: true,
  },
  {
    id: '2',
    name: 'Smartphone Ultra X',
    description: 'Smartphone com câmera de 108MP, 5G e bateria de longa duração',
    price: 2899.99,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
    category: 'Eletrônicos',
    stock: 30,
    featured: true,
  },
  {
    id: '3',
    name: 'Fone Bluetooth Premium',
    description: 'Fone de ouvido com cancelamento de ruído ativo e som Hi-Fi',
    price: 449.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    category: 'Acessórios',
    stock: 50,
    featured: false,
  },
  {
    id: '4',
    name: 'Smartwatch Fitness',
    description: 'Relógio inteligente com monitor cardíaco e GPS integrado',
    price: 899.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    category: 'Acessórios',
    stock: 25,
    featured: true,
  },
  {
    id: '5',
    name: 'Câmera DSLR Pro',
    description: 'Câmera profissional 24MP com lente 18-55mm inclusa',
    price: 3299.99,
    image: 'https://images.unsplash.com/photo-1606980707079-4c0c23c76e92?w=500',
    category: 'Fotografia',
    stock: 10,
    featured: false,
  },
  {
    id: '6',
    name: 'Tablet Ultra HD',
    description: 'Tablet 12 polegadas com tela AMOLED e caneta stylus',
    price: 1799.99,
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500',
    category: 'Eletrônicos',
    stock: 20,
    featured: true,
  },
];

// Funções de Produtos
function getProducts() {
  const stored = localStorage.getItem(PRODUCTS_KEY);
  if (!stored) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(initialProducts));
    return initialProducts;
  }
  return JSON.parse(stored);
}

function saveProducts(products) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

function addProduct(product) {
  const products = getProducts();
  products.push(product);
  saveProducts(products);
}

function updateProduct(id, updatedProduct) {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedProduct };
    saveProducts(products);
  }
}

function deleteProduct(id) {
  const products = getProducts().filter(p => p.id !== id);
  saveProducts(products);
}

function getProductById(id) {
  const products = getProducts();
  return products.find(p => p.id === id);
}

// Funções do Carrinho
function getCart() {
  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function addToCart(product) {
  const cart = getCart();
  const existingItem = cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  showNotification('Produto adicionado ao carrinho!', 'success');
}

function updateCartQuantity(id, quantity) {
  const cart = getCart();
  const item = cart.find(item => item.id === id);

  if (item) {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      item.quantity = quantity;
      saveCart(cart);
    }
  }
}

function removeFromCart(id) {
  const cart = getCart().filter(item => item.id !== id);
  saveCart(cart);
  showNotification('Produto removido do carrinho', 'info');
}

function clearCart() {
  saveCart([]);
  showNotification('Carrinho limpo com sucesso', 'success');
}

function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCartCount() {
  const cart = getCart();
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Atualizar contador do carrinho em todas as páginas
function updateCartCount() {
  const cartBadge = document.querySelector('.cart-badge');
  if (cartBadge) {
    const count = getCartCount();
    if (count > 0) {
      cartBadge.textContent = count;
      cartBadge.style.display = 'flex';
    } else {
      cartBadge.style.display = 'none';
    }
  }
}

// Sistema de notificações
function showNotification(message, type = 'info') {
  // Remover notificação anterior se existir
  const existingNotif = document.querySelector('.notification');
  if (existingNotif) {
    existingNotif.remove();
  }

  // Criar notificação
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  // Estilos da notificação
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#43a047' : type === 'danger' ? '#e53935' : '#1e88e5'};
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    animation: slideIn 0.3s ease;
  `;

  document.body.appendChild(notification);

  // Remover após 3 segundos
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Adicionar estilos de animação
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// ============= Funções de Autenticação =============

function getUsers() {
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function registerUser(name, email, password) {
  const users = getUsers();
  
  // Verifica se o email já está cadastrado
  if (users.find(u => u.email === email)) {
    return { success: false, message: 'Este e-mail já está cadastrado.' };
  }

  // Validações básicas
  if (name.length < 3) {
    return { success: false, message: 'Nome deve ter pelo menos 3 caracteres.' };
  }

  if (!email.includes('@') || !email.includes('.')) {
    return { success: false, message: 'E-mail inválido.' };
  }

  if (password.length < 6) {
    return { success: false, message: 'Senha deve ter pelo menos 6 caracteres.' };
  }

  const newUser = {
    id: Date.now().toString(),
    name,
    email,
    password, // Em produção, use hash de senha!
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);

  return { success: true, message: 'Usuário cadastrado com sucesso!' };
}

function loginUser(email, password) {
  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return { success: false, message: 'E-mail ou senha incorretos.' };
  }

  // Salva usuário atual (sem a senha)
  const currentUser = {
    id: user.id,
    name: user.name,
    email: user.email
  };
  
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));

  return { success: true, user: currentUser };
}

function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
}

function getCurrentUser() {
  const stored = localStorage.getItem(CURRENT_USER_KEY);
  return stored ? JSON.parse(stored) : null;
}

function isLoggedIn() {
  return getCurrentUser() !== null;
}

// Inicializar contador ao carregar página
document.addEventListener('DOMContentLoaded', updateCartCount);
