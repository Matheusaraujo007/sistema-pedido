import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN, // Read/Write ou Read-only
});

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ erro: 'Método não permitido' });

  try {
    // Busca todas as chaves de pedidos
    const chaves = await redis.keys('pedido:*');

    const pedidos = [];
    for (const chave of chaves) {
      const pedidoJson = await redis.get(chave);
      if (pedidoJson) pedidos.push(JSON.parse(pedidoJson));
    }

    res.status(200).json(pedidos);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
}
