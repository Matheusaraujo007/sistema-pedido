import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ erro: 'Método não permitido' });
  }

  try {
    await client.connect();
    const db = client.db();
    const pedidos = await db.collection('pedidos').find().toArray();

    return res.status(200).json(pedidos);
  } catch (err) {
    console.error('Erro ao buscar pedidos:', err);
    return res.status(500).json({ erro: err.message });
  }
}
