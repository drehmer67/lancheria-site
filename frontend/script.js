// PRODUTOS
const produtos = [
  // 🍔 BURGERS
  {
    nome: "X-Burger",
    preco: 15,
    categoria: "Burgers",
    img: "../assets/imagens/xburger.jpg"
  },
  {
    nome: "X-Salada",
    preco: 18,
    categoria: "Burgers",
    img: "../assets/imagens/xsalada.jpg"
  },
  {
    nome: "X-Bacon",
    preco: 20,
    categoria: "Burgers",
    img: "../assets/imagens/xburger.jpg"
  },
  {
    nome: "X-Tudo",
    preco: 25,
    categoria: "Burgers",
    img: "../assets/imagens/xburger.jpg"
  },

  // 🍟 PORÇÕES
  {
    nome: "Batata Frita P",
    preco: 10,
    categoria: "Porções",
    img: "../assets/imagens/batata.jpg"
  },
  {
    nome: "Batata Frita G",
    preco: 18,
    categoria: "Porções",
    img: "../assets/imagens/batata.jpg"
  },

  // 🥤 BEBIDAS
  {
    nome: "Coca-Cola Lata",
    preco: 6,
    categoria: "Bebidas",
    img: "../assets/imagens/refri.jpg"
  },
  {
    nome: "Guaraná Lata",
    preco: 6,
    categoria: "Bebidas",
    img: "../assets/imagens/refri.jpg"
  },
  {
    nome: "Suco Natural",
    preco: 8,
    categoria: "Bebidas",
    img: "../assets/imagens/refri.jpg"
  },

  // 🍔🔥 COMBOS
  {
    nome: "Combo X-Burger + Batata + Refri",
    preco: 25,
    categoria: "Combos",
    img: "../assets/imagens/xburger.jpg"
  },
  {
    nome: "Combo X-Salada + Batata + Refri",
    preco: 28,
    categoria: "Combos",
    img: "../assets/imagens/xsalada.jpg"
  }
];

// CARRINHO
let carrinho = [];

// ELEMENTOS
const divProdutos = document.getElementById("produtos");
const ulCarrinho = document.getElementById("carrinho");
const totalEl = document.getElementById("total");
const modal = document.getElementById("modal");
const overlay = document.getElementById("overlay");
const telaCardapio = document.getElementById("tela-cardapio");

// RENDER PRODUTOS
const categorias = ["Burgers", "Porções", "Bebidas", "Combos"];

categorias.forEach(cat => {
  const titulo = document.createElement("h2");
  titulo.innerText = cat;
  divProdutos.appendChild(titulo);

  produtos
    .filter(p => p.categoria === cat)
    .forEach((produto, index) => {
      const i = produtos.indexOf(produto);

      const div = document.createElement("div");
      div.className = "produto";

      div.innerHTML = `
        <img src="${produto.img}">
        <h3>${produto.nome}</h3>
        <p>R$ ${produto.preco}</p>
        <button onclick="adicionar(${i})">Adicionar</button>
      `;

      divProdutos.appendChild(div);
    });
});

// ABRIR CARRINHO
function abrirCarrinho() {
  modal.classList.add("ativo");
  overlay.classList.add("ativo");

  document.getElementById("tela-cardapio").style.display = "none";
}

// FECHAR CARRINHO
function fecharCarrinho() {
  modal.classList.remove("ativo");
  overlay.classList.remove("ativo");

  telaCardapio.style.display = "block";
}

// BOTÃO CARDÁPIO
function irCardapio() {
  fecharCarrinho();

  const tela = document.getElementById("tela-cardapio");
  tela.style.display = "block";
}

// ADICIONAR ITEM
function adicionar(index) {
  const item = carrinho.find(p => p.nome === produtos[index].nome);

  if (item) {
    item.qtd++;
  } else {
    carrinho.push({ ...produtos[index], qtd: 1 });
  }

  atualizarCarrinho();
}

// AUMENTAR
function aumentar(index) {
  carrinho[index].qtd++;
  atualizarCarrinho();
}

// DIMINUIR
function diminuir(index) {
  if (carrinho[index].qtd > 1) {
    carrinho[index].qtd--;
  } else {
    carrinho.splice(index, 1);
  }

  atualizarCarrinho();
}

// REMOVER
function remover(index) {
  carrinho.splice(index, 1);
  atualizarCarrinho();
}

// ATUALIZAR CARRINHO
function atualizarCarrinho() {
  ulCarrinho.innerHTML = "";
  let total = 0;

  carrinho.forEach((item, index) => {
    total += item.preco * item.qtd;

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
}

// FINALIZAR PEDIDO
function finalizarPedido() {
  if (carrinho.length === 0) {
    alert("Carrinho vazio!");
    return;
  }

  const total = carrinho.reduce((t, i) => t + i.preco * i.qtd, 0);

  const pedido = {
    itens: carrinho,
    total: total,
    data: new Date()
  };

  // ENVIA PRO BACKEND
  fetch("http://127.0.0.1:3000/pedido", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(pedido)
  });

  // WHATSAPP
  let mensagem = "Pedido:%0A";

  carrinho.forEach(item => {
    mensagem += `- ${item.nome} x${item.qtd} = R$${item.preco * item.qtd}%0A`;
  });

  mensagem += `%0ATotal: R$ ${total}`;

  const telefone = "5551999999999";

  window.open(`https://wa.me/${telefone}?text=${mensagem}`, "_blank");

  carrinho = [];
  atualizarCarrinho();
  fecharCarrinho();
}