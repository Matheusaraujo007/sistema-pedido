import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // Defina no Vercel
const client = new MongoClient(uri);

let db;

async function conectarMongo() {
  if (!db) {
    await client.connect();
    db = client.db(); // usa o banco definido no URI
  }
  return db;
}

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
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

      if (!vendedor || !nomeCliente || !telefoneCliente || !itens || !dataPedido) {
        return res.status(400).json({ erro: "Dados incompletos" });
      }

      const pedido = {
        vendedor,
        nomeCliente,
        telefoneCliente,
        itens,
        dataPedido,
        dataEntrega,
        valorTotal,
        valorRecebido,
        status
      };

      const database = await conectarMongo();
      const collection = database.collection("pedidos");

      const result = await collection.insertOne(pedido);

      return res.status(200).json({ sucesso: true, id: result.insertedId });
    }

    // GET - Listar pedidos
    if (req.method === 'GET') {
      const database = await conectarMongo();
      const pedidos = await database.collection("pedidos").find().toArray();
      return res.status(200).json(pedidos);
    }

    res.status(405).json({ erro: 'Método não permitido' });

  } catch (err) {
    console.error("Erro ao salvar pedido:", err);
    res.status(500).json({ erro: err.message });
  }
}
