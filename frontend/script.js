// ================= PRODUTOS =================
const produtos = [
  { nome: "X-Burger", preco: 15, categoria: "Burgers", img: "../assets/imagens/xburger.jpg" },
  { nome: "X-Salada", preco: 18, categoria: "Burgers", img: "../assets/imagens/xsalada.jpg" },
  { nome: "X-Bacon", preco: 20, categoria: "Burgers", img: "../assets/imagens/xburger.jpg" },
  { nome: "X-Tudo", preco: 25, categoria: "Burgers", img: "../assets/imagens/xburger.jpg" },

  { nome: "Batata Frita P", preco: 10, categoria: "Porções", img: "../assets/imagens/batata.jpg" },
  { nome: "Batata Frita G", preco: 18, categoria: "Porções", img: "../assets/imagens/batata.jpg" },

  { nome: "Coca-Cola", preco: 6, categoria: "Bebidas", img: "../assets/imagens/refri.jpg" },
  { nome: "Guaraná", preco: 6, categoria: "Bebidas", img: "../assets/imagens/refri.jpg" },
  { nome: "Suco Natural", preco: 8, categoria: "Bebidas", img: "../assets/imagens/refri.jpg" },

  { nome: "Combo X-Burger", preco: 25, categoria: "Combos", img: "../assets/imagens/xburger.jpg" },
  { nome: "Combo X-Salada", preco: 28, categoria: "Combos", img: "../assets/imagens/xsalada.jpg" }
];

// ================= VARIÁVEIS =================
let carrinho = [];
let categoriaAtiva = "Todos";

// ================= ELEMENTOS =================
const divProdutos = document.getElementById("produtos");
const ulCarrinho = document.getElementById("carrinho");
const totalEl = document.getElementById("total");
const badge = document.getElementById("badge");
const divCategorias = document.getElementById("categorias");

// ================= CATEGORIAS =================
const categoriasUnicas = ["Todos", ...new Set(produtos.map(p => p.categoria))];

categoriasUnicas.forEach(cat => {
  const btn = document.createElement("button");
  btn.innerText = cat;
  btn.className = "categoria-btn";

  if (cat === "Todos") btn.classList.add("ativa");

  btn.onclick = () => {
    categoriaAtiva = cat;

    document.querySelectorAll(".categoria-btn")
      .forEach(b => b.classList.remove("ativa"));

    btn.classList.add("ativa");

    renderProdutos();
  };

  divCategorias.appendChild(btn);
});

// ================= RENDER PRODUTOS =================
function renderProdutos() {
  divProdutos.innerHTML = "";

  const filtrados = categoriaAtiva === "Todos"
    ? produtos
    : produtos.filter(p => p.categoria === categoriaAtiva);

  filtrados.forEach(produto => {
    const index = produtos.indexOf(produto);

    const div = document.createElement("div");
    div.className = "produto";

    div.innerHTML = `
      <img src="${produto.img}">
      <h3>${produto.nome}</h3>
      <p>R$ ${produto.preco}</p>
      <button onclick="adicionar(${index})">Adicionar</button>
    `;

    divProdutos.appendChild(div);
  });
}

// ================= CARRINHO =================
function adicionar(index) {
  const item = carrinho.find(p => p.nome === produtos[index].nome);

  if (item) item.qtd++;
  else carrinho.push({ ...produtos[index], qtd: 1 });

  atualizarCarrinho();
}

function aumentar(index) {
  carrinho[index].qtd++;
  atualizarCarrinho();
}

function diminuir(index) {
  if (carrinho[index].qtd > 1) carrinho[index].qtd--;
  else carrinho.splice(index, 1);

  atualizarCarrinho();
}

function remover(index) {
  carrinho.splice(index, 1);
  atualizarCarrinho();
}

// ================= ATUALIZAR =================
function atualizarCarrinho() {
  ulCarrinho.innerHTML = "";
  let total = 0;
  let totalItens = 0;

  carrinho.forEach((item, index) => {
    total += item.preco * item.qtd;
    totalItens += item.qtd;

    const li = document.createElement("li");

    li.innerHTML = `
      <strong>${item.nome}</strong><br>
      R$ ${item.preco} x${item.qtd} = R$ ${item.preco * item.qtd}
      <br>
      <button onclick="aumentar(${index})">➕</button>
      <button onclick="diminuir(${index})">➖</button>
      <button onclick="remover(${index})">❌</button>
    `;

    ulCarrinho.appendChild(li);
  });

  totalEl.innerText = `Total: R$ ${total}`;
  badge.innerText = totalItens;
}

// ================= FINALIZAR =================
function finalizarPedido() {
  if (carrinho.length === 0) {
    alert("Carrinho vazio!");
    return;
  }

  const total = carrinho.reduce((t, i) => t + i.preco * i.qtd, 0);

  fetch("http://127.0.0.1:3000/pedido", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      itens: carrinho,
      total: total,
      data: new Date()
    })
  });

  let mensagem = "Pedido:%0A";

  carrinho.forEach(item => {
    mensagem += `- ${item.nome} x${item.qtd}%0A`;
  });

  mensagem += `%0ATotal: R$ ${total}`;

  window.open(`https://wa.me/5551999999999?text=${mensagem}`, "_blank");

  carrinho = [];
  atualizarCarrinho();
}

// ================= INICIAL =================
renderProdutos();