const sampleProducts = [
  { id: 1, name: "Luminária Pixel Fox", price: 129.9, category: "Decoração", img: "https://picsum.photos/seed/pixelfox/400/300" },
  { id: 2, name: "Camiseta Retro Gamer", price: 69.9, category: "Camisetas", img: "https://picsum.photos/seed/retrogamer/400/300" },
  { id: 3, name: "Mousepad RGB - Nebula", price: 49.9, category: "Acessórios", img: "https://picsum.photos/seed/nebulamouse/400/300" },
  { id: 4, name: "Poster Animado - Fredbear", price: 39.9, category: "Decoração", img: "https://picsum.photos/seed/fredposter/400/300" },
  { id: 5, name: "Pacote Wallpapers 4K", price: 19.9, category: "Digitais", img: "https://picsum.photos/seed/wallpack/400/300" },
  { id: 6, name: "Chaveiro 3D - Controller", price: 24.9, category: "Acessórios", img: "https://picsum.photos/seed/keyctrl/400/300" }
];

let cart = JSON.parse(localStorage.getItem('cart')) || [];

const productsEl = document.getElementById('products');
const searchEl = document.getElementById('search');
const categoriesEl = document.getElementById('categories');
const resultsCountEl = document.getElementById('results-count');
const cartCountEl = document.getElementById('cart-count');
const cartDrawer = document.getElementById('cart-drawer');
const btnCart = document.getElementById('btn-cart');
const closeCart = document.getElementById('close-cart');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const checkout = document.getElementById('checkout');

renderCategories();
renderProducts(sampleProducts);
updateCartUI();

// CATEGORIAS
function renderCategories() {
  const cats = [...new Set(sampleProducts.map(p=>p.category))];
  categoriesEl.innerHTML='';
  const allBtn = document.createElement('button');
  allBtn.textContent='Todas';
  allBtn.onclick=()=>{ applyFilters(''); };
  categoriesEl.appendChild(allBtn);
  cats.forEach(c=>{
    const b=document.createElement('button');
    b.textContent=c;
    b.onclick=()=>{ applyFilters(c); };
    categoriesEl.appendChild(b);
  });
}

// PRODUTOS
function renderProducts(list) {
  productsEl.innerHTML='';
  if(list.length===0){
    productsEl.innerHTML='<p class="muted">Nenhum produto encontrado.</p>';
    resultsCountEl.textContent='Mostrando 0 itens';
    return;
  }
  resultsCountEl.textContent=`Mostrando ${list.length} itens`;
  list.forEach(p=>{
    const card=document.createElement('div');
    card.className='card';
    card.innerHTML=`
      <img src="${p.img}" alt="${p.name}" />
      <h3>${p.name}</h3>
      <div class="cat">${p.category}</div>
      <div class="price">R$ ${p.price.toFixed(2)}</div>
      <div class="card-actions">
        <button class="btn primary view-btn" data-id="${p.id}">Ver detalhes</button>
        <div class="qty-add">
          <button class="btn minus" data-id="${p.id}">-</button>
          <input type="number" class="qty" data-id="${p.id}" value="1" min="1">
          <button class="btn plus" data-id="${p.id}">+</button>
        </div>
        <button class="btn add-btn" data-id="${p.id}">Adicionar</button>
      </div>
    `;
    productsEl.appendChild(card);
  });

  // EVENTOS
  document.querySelectorAll('.view-btn').forEach(b=>{
    b.addEventListener('click',e=>{
      const id = e.currentTarget.dataset.id;
      window.location.href=`produto.html?id=${id}`;
    });
  });

  document.querySelectorAll('.add-btn').forEach(b=>{
    b.addEventListener('click',e=>{
      const id = Number(e.currentTarget.dataset.id);
      const qty = Number(document.querySelector(`.qty[data-id="${id}"]`).value);
      const prod = sampleProducts.find(x=>x.id===id);
      addToCart(prod,qty);
    });
  });

  document.querySelectorAll('.plus').forEach(b=>{
    b.addEventListener('click',e=>{
      const id=e.currentTarget.dataset.id;
      const input=document.querySelector(`.qty[data-id="${id}"]`);
      input.value=Number(input.value)+1;
    });
  });

  document.querySelectorAll('.minus').forEach(b=>{
    b.addEventListener('click',e=>{
      const id=e.currentTarget.dataset.id;
      const input=document.querySelector(`.qty[data-id="${id}"]`);
      if(Number(input.value)>1) input.value=Number(input.value)-1;
    });
  });
}

// FILTROS E BUSCA
searchEl.addEventListener('input',()=>applyFilters());
document.querySelectorAll('.filter-btn').forEach(btn=>{
  btn.addEventListener('click',e=>{
    const filter=e.currentTarget.dataset.filter;
    applyFilters('',filter);
  });
});

function applyFilters(category='',quickFilter=''){
  const q=searchEl.value.trim().toLowerCase();
  let out = sampleProducts.filter(p=>{
    const matchSearch=p.name.toLowerCase().includes(q)||p.category.toLowerCase().includes(q);
    const matchCategory = category? p.category===category:true;
    const matchQuick = quickFilter==='promo'? p.price<50: quickFilter==='best'? p.id%2===0:true;
    return matchSearch && matchCategory && matchQuick;
  });
  renderProducts(out);
}

// CARRINHO
function addToCart(prod,qty=1){
  const found=cart.find(c=>c.id===prod.id);
  if(found) found.qty+=qty;
  else cart.push({...prod,qty});
  updateCartUI();
  localStorage.setItem('cart',JSON.stringify(cart));
}

function updateCartUI(){
  cartCountEl.textContent = cart.reduce((s,i)=>s+i.qty,0);
  cartItemsEl.innerHTML='';
  if(cart.length===0) cartItemsEl.innerHTML='<p class="muted">Carrinho vazio.</p>';
  cart.forEach(i=>{
    const el=document.createElement('div');
    el.className='cart-item';
    el.innerHTML=`
      <img src="${i.img}" alt="${i.name}" />
      <div class="info">
        <div class="name">${i.name}</div>
        <div class="qty">${i.qty} x R$ ${i.price.toFixed(2)}</div>
      </div>
      <button class="btn remove" data-id="${i.id}">Remover</button>
    `;
    cartItemsEl.appendChild(el);
  });
  document.querySelectorAll('.remove').forEach(b=>{
    b.addEventListener('click',e=>{
      const id=Number(e.currentTarget.dataset.id);
      cart = cart.filter(c=>c.id!==id);
      updateCartUI();
      localStorage.setItem('cart',JSON.stringify(cart));
    });
  });
  cartTotalEl.textContent = cart.reduce((s,i)=>s+i.price*i.qty,0).toFixed(2);
}

// EVENTOS CARRINHO
btnCart.addEventListener('click',()=>cartDrawer.classList.add('open'));
closeCart.addEventListener('click',()=>cartDrawer.classList.remove('open'));
checkout.addEventListener('click',()=>alert('Simulação de compra!'));

document.addEventListener('click',e=>{
  if(!cartDrawer.classList.contains('open')) return;
  const within=e.composedPath().includes(cartDrawer)||e.target.id==='btn-cart';
  if(!within) cartDrawer.classList.remove('open');
});
