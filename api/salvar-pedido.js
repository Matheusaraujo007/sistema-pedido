// pages/api/salvar-pedido.js (para Vercel)
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // Defina no Vercel
const client = new MongoClient(uri);

async function conectarMongo() {
  if (!client.isConnected()) await client.connect();
  return client.db(); // usa o database definido na URI
}

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      // Recebe dados do body
      const {
        vendedor,
        nomeCliente,
        telefoneCliente,
        itens,
        dataPedido,
        dataEntrega,
        valorTotal,
        valorRecebido,
        status
      } = req.body;

      // Validação mínima
      if (!nomeCliente || !itens || !Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({ erro: "Campos obrigatórios ausentes ou inválidos" });
      }

      // Monta objeto do pedido
      const pedido = {
        vendedor: vendedor || "Não informado",
        nomeCliente,
        telefoneCliente: telefoneCliente || "Não informado",
        itens,
        dataPedido: dataPedido || new Date().toISOString().split("T")[0],
        dataEntrega: dataEntrega || "",
        valorTotal: parseFloat(valorTotal) || 0,
        valorRecebido: parseFloat(valorRecebido) || 0,
        status: status || "Aguardando Retorno",
        criadoEm: new Date()
      };

      // Conecta ao MongoDB e salva
      const db = await conectarMongo();
      const result = await db.collection("pedidos").insertOne(pedido);

      return res.status(200).json({ sucesso: true, id: result.insertedId });
    }

    // GET - listar pedidos
    if (req.method === "GET") {
      const db = await conectarMongo();
      const pedidos = await db.collection("pedidos").find().toArray();
      return res.status(200).json(pedidos);
    }

    // Métodos não permitidos
    return res.status(405).json({ erro: "Método não permitido" });
  } catch (err) {
    console.error("❌ Erro ao salvar ou buscar pedido:", err);
    return res.status(500).json({ erro: "Erro no servidor", detalhes: err.message });
  }
}
