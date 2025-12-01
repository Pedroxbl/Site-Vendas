// ---------------- PRODUTOS ---------------- //
const produtos = [
  { id: 1, nome: "Teclado Mecânico", preco: 299.90, cat: "Hardware", img: "./img/teclado.png" },
  { id: 2, nome: "Mouse Gamer RGB", preco: 159.90, cat: "Periféricos", img: "./img/mouse.png" },
  { id: 3, nome: "Headset Surround", preco: 349.90, cat: "Games", img: "./img/headset.png" },
  { id: 4, nome: "Monitor 165Hz", preco: 899.90, cat: "Computadores", img: "./img/monitor.png" }
];


// ---------------- LOCALSTORAGE CARRINHO ---------------- //
function loadCart() { return JSON.parse(localStorage.getItem("cart") || "[]"); }
function saveCart(cart) { localStorage.setItem("cart", JSON.stringify(cart)); }

function addToCart(id) {
  const cart = loadCart();
  const item = produtos.find(p => p.id === id);
  cart.push(item);
  saveCart(cart);
  updateCartCount();

  alert("Adicionado ;)");
}

function updateCartCount() {
  const count = loadCart().length;
  const el = document.getElementById("cartCount");
  if (el) el.textContent = count;
}


// ---------------- INDEX: RENDER PRODUTOS ---------------- //
function renderProducts(filter = null) {
  const list = document.getElementById("productList");
  if (!list) return;

  list.innerHTML = "";

  produtos
    .filter(p => !filter || p.cat === filter)
    .forEach(p => {
      list.innerHTML += `
      <div class="produto-card">
        <div class="prod-img" style="background-image:url('${p.img}')"></div>
        <h3>${p.nome}</h3>
        <p>R$ ${p.preco.toFixed(2)}</p>
        <button class="btn primary" onclick="addToCart(${p.id})">Adicionar</button>
      </div>
      `;
    });
}


// ---------------- CATEGORIAS ---------------- //
const categoryList = document.getElementById("categoryList");
if (categoryList) {
  categoryList.querySelectorAll("li").forEach(li => {
    li.onclick = () => renderProducts(li.dataset.cat);
  });
}


// ---------------- PESQUISA ---------------- //
const searchBar = document.getElementById("searchBar");
const searchPopup = document.getElementById("searchPopup");

if (searchBar) {
  searchBar.addEventListener("input", () => {
    const text = searchBar.value.toLowerCase();
    searchPopup.classList.add("show");

    const results = produtos.filter(p => p.nome.toLowerCase().includes(text));

    if (results.length === 0) {
      searchPopup.innerHTML = "Sem resultados...";
      return;
    }

    searchPopup.innerHTML = results.map(p => `<p>${p.nome}</p>`).join("");
  });
}


// ---------------- CARRINHO PAGE ---------------- //
function renderCart() {
  const area = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  if (!area) return;

  let cart = loadCart();
  let total = 0;
  area.innerHTML = "";

  cart.forEach((item, i) => {
    total += item.preco;
    area.innerHTML += `
      <div class="cart-item">
        <strong>${item.nome}</strong><br>
        R$ ${item.preco.toFixed(2)}<br><br>
        <button class="btn" onclick="removeItem(${i})">Remover</button>
      </div>
    `;
  });

  totalEl.textContent = total.toFixed(2);
}

function removeItem(index) {
  let cart = loadCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
  updateCartCount();
}


// ---------------- CHECKOUT PAGE ---------------- //
function renderCheckout() {
  const area = document.getElementById("checkoutResumo");
  const totalEl = document.getElementById("checkoutTotal");
  if (!area) return;

  let cart = loadCart();
  let total = 0;

  cart.forEach(item => {
    total += item.preco;
    area.innerHTML += `<p>${item.nome} — R$ ${item.preco.toFixed(2)}</p>`;
  });

  totalEl.textContent = total.toFixed(2);
}


// ---------------- INIT ---------------- //
updateCartCount();
renderProducts();
renderCart();
renderCheckout();
