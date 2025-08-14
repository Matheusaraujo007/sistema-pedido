import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // Defina no Vercel
const dbName = process.env.MONGODB_DB || "meuBanco"; // Nome do banco

let cachedClient = null;
let cachedDb = null;

// Função para conectar ao MongoDB apenas uma vez (evita múltiplas conexões no Vercel)
async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  await client.connect();
  
  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { cliente, produto, quantidade } = req.body;

    if (!cliente || !produto || !quantidade) {
      return res.status(400).json({ error: 'Dados incompletos' });
    }

    // Conectar ao MongoDB
    const { db } = await connectToDatabase();
    const pedidosCollection = db.collection("pedidos");

    // Inserir pedido
    await pedidosCollection.insertOne({
      cliente,
      produto,
      quantidade,
      data: new Date()
    });

    return res.status(200).json({ message: 'Pedido salvo com sucesso' });

  } catch (err) {
    console.error('Erro ao salvar pedido:', err);
    return res.status(500).json({ error: 'Erro no servidor', details: err.message });
  }
}
