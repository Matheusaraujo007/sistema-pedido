import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ erro: 'Método não permitido' });

  try {
    const data = await redis.lrange('pedidos', 0, -1);
    const pedidos = data.map(item => JSON.parse(item));
    res.status(200).json(pedidos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: err.message });
  }
}
