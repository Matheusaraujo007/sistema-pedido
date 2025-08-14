import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);

export default async function handler(req, res) {
  try {
    await client.connect();
    const db = client.db();
    const count = await db.collection("pedidos").countDocuments();
    return res.status(200).json({ sucesso: true, totalPedidos: count });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: err.message });
  }
}
