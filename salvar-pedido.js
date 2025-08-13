import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ sucesso: false, erro: 'Método não permitido' });
  }

  try {
    const pedido = req.body;
    const chave = `pedido:${Date.now()}`;
    await redis.set(chave, JSON.stringify(pedido));
    res.status(200).json({ sucesso: true, chave });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message });
  }
}
