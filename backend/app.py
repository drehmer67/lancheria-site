from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)

# 🔥 LIBERA CORS CORRETAMENTE
CORS(app, resources={r"/*": {"origins": "*"}})

pedidos = []

# RECEBER PEDIDO
@app.route("/pedido", methods=["POST"])
def receber_pedido():
    data = request.json
    data["status"] = "Pendente"
    pedidos.append(data)
    return jsonify({"mensagem": "Pedido recebido!"})

# LISTAR PEDIDOS
@app.route("/pedidos", methods=["GET"])
def listar_pedidos():
    return jsonify(pedidos)

# ATUALIZAR STATUS
@app.route("/pedido/<int:index>", methods=["PUT", "OPTIONS"])
def atualizar_status(index):
    if request.method == "OPTIONS":
        return '', 200

    novo_status = request.json.get("status")
    pedidos[index]["status"] = novo_status
    return jsonify({"mensagem": "Status atualizado!"})

app.run(host="0.0.0.0", port=3000)