from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

# 🔥 CORS liberado (frontend local + deploy)
CORS(app, resources={r"/*": {"origins": "*"}})

pedidos = []

# ================= RECEBER PEDIDO =================
@app.route("/pedido", methods=["POST"])
def receber_pedido():
    data = request.json

    if not data or "itens" not in data:
        return jsonify({"erro": "Pedido inválido"}), 400

    data["status"] = "Pendente"
    pedidos.append(data)

    return jsonify({
        "mensagem": "Pedido recebido!",
        "id": len(pedidos) - 1
    })

# ================= LISTAR PEDIDOS =================
@app.route("/pedidos", methods=["GET"])
def listar_pedidos():
    return jsonify(pedidos)

# ================= ATUALIZAR STATUS =================
@app.route("/pedido/<int:index>", methods=["PUT", "OPTIONS"])
def atualizar_status(index):

    # 🔥 RESPOSTA PARA PREFLIGHT (CORS)
    if request.method == "OPTIONS":
        return '', 200

    # 🔥 VALIDAÇÃO
    if index < 0 or index >= len(pedidos):
        return jsonify({"erro": "Pedido não encontrado"}), 404

    data = request.json
    novo_status = data.get("status")

    if not novo_status:
        return jsonify({"erro": "Status inválido"}), 400

    pedidos[index]["status"] = novo_status

    return jsonify({"mensagem": "Status atualizado!"})

# ================= DELETAR PEDIDO (EXTRA TOP) =================
@app.route("/pedido/<int:index>", methods=["DELETE"])
def deletar_pedido(index):

    if index < 0 or index >= len(pedidos):
        return jsonify({"erro": "Pedido não encontrado"}), 404

    pedidos.pop(index)

    return jsonify({"mensagem": "Pedido removido!"})

# ================= RODAR =================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3000, debug=True)