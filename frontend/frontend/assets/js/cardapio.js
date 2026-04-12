const produtos = [
  { nome: "X-Burger", preco: 15, categoria: "Burgers" },
  { nome: "X-Salada", preco: 18, categoria: "Burgers" },
  { nome: "Coca-Cola", preco: 6, categoria: "Bebidas" },
  { nome: "Guaraná", preco: 6, categoria: "Bebidas" },
  { nome: "Batata Frita", preco: 12, categoria: "Porções" }
];

function carregarCardapio() {
  const container = document.getElementById("cardapio");
  container.innerHTML = "";

  const categorias = [...new Set(produtos.map(p => p.categoria))];

  categorias.forEach(cat => {
    const bloco = document.createElement("section");

    bloco.innerHTML = `
      <h2>${cat}</h2>
      <div class="grid">
        ${produtos
          .filter(p => p.categoria === cat)
          .map(p => `
            <div class="item">
              <h3>${p.nome}</h3>
              <p>R$ ${p.preco.toFixed(2)}</p>
            </div>
          `).join("")}
      </div>
    `;

    container.appendChild(bloco);
  });
}

carregarCardapio();