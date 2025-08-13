import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const pedidos = await redis.lrange('pedidos', 0, -1);
      const pedidosJSON = pedidos.map(p => JSON.parse(p));
      res.status(200).json(pedidosJSON);
    } catch (err) {
      res.status(500).json({ erro: err.message });
    }
  } else {
    res.status(405).json({ erro: 'Método não permitido' });
  }
}
