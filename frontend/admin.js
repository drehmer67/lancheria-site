const lista = document.getElementById("lista");

function corStatus(status) {
  if (status === "Pendente") return "pendente";
  if (status === "Preparando") return "preparando";
  if (status === "Pronto") return "pronto";
}

async function carregarPedidos() {
  const res = await fetch("http://127.0.0.1:3000/pedidos");
  const pedidos = await res.json();

  lista.innerHTML = "";

  pedidos.forEach((pedido, i) => {
    const div = document.createElement("div");
    div.className = "card";

    let itens = "";
    pedido.itens.forEach(item => {
      itens += `<li>${item.nome} x${item.qtd}</li>`;
    });

    div.innerHTML = `
      <h3>Pedido #${i + 1}</h3>

      <ul>${itens}</ul>

      <p>Total: <strong>R$ ${pedido.total}</strong></p>

      <p>Status: 
        <span class="status ${corStatus(pedido.status)}">
          ${pedido.status}
        </span>
      </p>

      <button class="preparando-btn" onclick="mudarStatus(${i}, 'Preparando')">
        Preparando
      </button>

      <button class="pronto-btn" onclick="mudarStatus(${i}, 'Pronto')">
        Pronto
      </button>
    `;

    lista.appendChild(div);
  });
}

// 🔥 ALTERAR STATUS
function mudarStatus(index, status) {
  fetch(`http://127.0.0.1:3000/pedido/${index}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status })
  }).then(() => carregarPedidos());
}

// 🔄 ATUALIZA AUTOMÁTICO
setInterval(carregarPedidos, 3000);

carregarPedidos();