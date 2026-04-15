const pendenteDiv = document.getElementById("pendente");
const preparandoDiv = document.getElementById("preparando");
const prontoDiv = document.getElementById("pronto");

// 🔥 CARREGAR PEDIDOS
async function carregarPedidos() {
  try {
    const res = await fetch("https://lancheria-backend.onrender.com/pedidos");
    const pedidos = await res.json();

    pendenteDiv.innerHTML = "";
    preparandoDiv.innerHTML = "";
    prontoDiv.innerHTML = "";

    pedidos.forEach((pedido, i) => {

      const card = document.createElement("div");
      card.className = "card";

      let itens = "";
      pedido.itens.forEach(item => {
        itens += `<li>${item.nome} x${item.qtd}</li>`;
      });

      card.innerHTML = `
        <h3>Pedido #${i + 1}</h3>
        <ul>${itens}</ul>
        <p><strong>R$ ${pedido.total}</strong></p>
      `;

      // BOTÕES
      if (pedido.status === "Pendente") {
        card.innerHTML += `
          <button class="preparar" onclick="mudarStatus(${i}, 'Preparando')">
            Iniciar
          </button>
        `;
        pendenteDiv.appendChild(card);
      }

      else if (pedido.status === "Preparando") {
        card.innerHTML += `
          <button class="pronto" onclick="mudarStatus(${i}, 'Pronto')">
            Finalizar
          </button>
        `;
        preparandoDiv.appendChild(card);
      }

      else if (pedido.status === "Pronto") {
        card.innerHTML += `
          <button class="remover" onclick="remover(${i})">
            Remover
          </button>
        `;
        prontoDiv.appendChild(card);
      }

    });

  } catch (err) {
    console.log("Erro:", err);
  }
}

// 🔥 MUDAR STATUS
function mudarStatus(index, status) {
  fetch(`https://lancheria-backend.onrender.com/pedido/${index}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ status })
  }).then(() => carregarPedidos());
}

// 🔥 REMOVER PEDIDO
function remover(index) {
  fetch(`https://lancheria-backend.onrender.com/pedido/${index}`, {
    method: "DELETE"
  }).then(() => carregarPedidos());
}

// 🔄 AUTO ATUALIZA
setInterval(carregarPedidos, 3000);

carregarPedidos();