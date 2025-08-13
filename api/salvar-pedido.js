import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv(); // ou use URL/TOKEN diretamente

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const pedido = req.body;

      // Salva pedido na lista 'pedidos'
      await redis.lpush('pedidos', JSON.stringify(pedido));

      res.status(200).json({ sucesso: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: err.message });
    }
  } else {
    res.status(405).json({ erro: 'Método não permitido' });
  }
}
