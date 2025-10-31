// Simulação do banco de dados
const sampleProducts = [
  { id: 1, name: "Luminária Pixel Fox", price: 129.9, category: "Decoração", img: "https://picsum.photos/seed/pixelfox/400/300", desc: "Luminária em formato de raposa pixelada, perfeita para decoração gamer." },
  { id: 2, name: "Camiseta Retro Gamer", price: 69.9, category: "Camisetas", img: "https://picsum.photos/seed/retrogamer/400/300", desc: "Camiseta com estampa retro de videogames clássicos." },
  { id: 3, name: "Mousepad RGB - Nebula", price: 49.9, category: "Acessórios", img: "https://picsum.photos/seed/nebulamouse/400/300", desc: "Mousepad RGB grande com efeito nebuloso e luzes ajustáveis." },
  { id: 4, name: "Poster Animado - Fredbear", price: 39.9, category: "Decoração", img: "https://picsum.photos/seed/fredposter/400/300", desc: "Poster animado de Fredbear com cores vibrantes." },
  { id: 5, name: "Pacote Wallpapers 4K", price: 19.9, category: "Digitais", img: "https://picsum.photos/seed/wallpack/400/300", desc: "Pacote de wallpapers em alta resolução para desktop e mobile." },
  { id: 6, name: "Chaveiro 3D - Controller", price: 24.9, category: "Acessórios", img: "https://picsum.photos/seed/keyctrl/400/300", desc: "Chaveiro 3D em formato de controle de videogame." }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Pegando o ID do produto via query string
const urlParams = new URLSearchParams(window.location.search);
const prodId = Number(urlParams.get('id'));
const product = sampleProducts.find(p => p.id === prodId) || sampleProducts[0];

// Elementos
const productImg = document.getElementById('product-img');
const productName = document.getElementById('product-name');
const productCategory = document.getElementById('product-category');
const productPrice = document.getElementById('product-price');
const productDesc = document.getElementById('product-desc');
const qtyInput = document.getElementById('qty');
const addToCartBtn = document.getElementById('add-to-cart');

const cartCountEl = document.getElementById('cart-count');
const cartDrawer = document.getElementById('cart-drawer');
const btnCart = document.getElementById('btn-cart');
const closeCart = document.getElementById('close-cart');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const checkout = document.getElementById('checkout');

// Preencher dados do produto
productImg.src = product.img;
productName.textContent = product.name;
productCategory.textContent = product.category;
productPrice.textContent = `R$ ${product.price.toFixed(2)}`;
productDesc.textContent = product.desc;

// Adicionar ao carrinho
addToCartBtn.addEventListener('click', () => {
  const qty = Number(qtyInput.value);
  const found = cart.find(c => c.id === product.id);
  if (found) found.qty += qty;
  else cart.push({...product, qty});
  updateCartUI();
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`${qty} x ${product.name} adicionado ao carrinho!`);
});

// Carrinho
btnCart.addEventListener('click', () => cartDrawer.classList.add('open'));
closeCart.addEventListener('click', () => cartDrawer.classList.remove('open'));
checkout.addEventListener('click', () => alert('Simulação de compra!'));

// Atualizar UI do carrinho
function updateCartUI() {
  cartCountEl.textContent = cart.reduce((s, i) => s + i.qty, 0);
  cartItemsEl.innerHTML = '';
  if(cart.length === 0) cartItemsEl.innerHTML = '<p class="muted">Carrinho vazio.</p>';
  cart.forEach(i => {
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <img src="${i.img}" alt="${i.name}" />
      <div class="info">
        <div class="name">${i.name}</div>
        <div class="qty">${i.qty} x R$ ${i.price.toFixed(2)}</div>
      </div>
      <button class="btn remove" data-id="${i.id}">Remover</button>`;
    cartItemsEl.appendChild(el);
  });
  document.querySelectorAll('.remove').forEach(b => b.addEventListener('click', e => {
    const id = Number(e.currentTarget.dataset.id);
    cart = cart.filter(c => c.id !== id);
    updateCartUI();
    localStorage.setItem('cart', JSON.stringify(cart));
  }));
  const total = cart.reduce((s,i)=> s + i.price*i.qty,0);
  cartTotalEl.textContent = total.toFixed(2);
}

// Inicial
updateCartUI();

// Fechar drawer clicando fora
document.addEventListener('click', e => {
  if(!cartDrawer.classList.contains('open')) return;
  const within = e.composedPath().includes(cartDrawer) || e.target.id === 'btn-cart';
  if(!within) cartDrawer.classList.remove('open');
});
