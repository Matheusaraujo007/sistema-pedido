import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI; // Defina no Vercel
const client = new MongoClient(uri);

export default async function handler(req, res) {
  try {
    await client.connect();
    const db = client.db("meus-pedidos"); // nome do banco
    const pedidosCollection = db.collection("pedidos");

    if (req.method === "POST") {
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

      const pedido = {
        vendedor: vendedor || "Não informado",
        nomeCliente: nomeCliente || "Não informado",
        telefoneCliente: telefoneCliente || "Não informado",
        itens: itens || [],
        dataPedido: dataPedido || "",
        dataEntrega: dataEntrega || "",
        valorTotal: parseFloat(valorTotal) || 0,
        valorRecebido: parseFloat(valorRecebido) || 0,
        status: status || "Aguardando Retorno"
      };

      await pedidosCollection.insertOne(pedido);
      return res.status(200).json({ sucesso: true });
    }

    if (req.method === "GET") {
      const pedidos = await pedidosCollection.find({}).toArray();
      return res.status(200).json(pedidos);
    }

    res.status(405).json({ erro: "Método não permitido" });

  } catch (err) {
    console.error("Erro no handler:", err);
    res.status(500).json({ erro: err.message });
  } finally {
    await client.close();
  }
}
