import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ erro: 'Método não permitido' });
  }

  try {
    // Lê todos os pedidos da lista 'pedidos'
    const data = await redis.lrange('pedidos', 0, -1);

    // Converte cada item para objeto
    const pedidos = data.map(item => {
      try { return JSON.parse(item); }
      catch { return {}; } // evita quebrar caso JSON inválido
    });

    res.status(200).json(pedidos);
  } catch (err) {
    console.error('Erro ao buscar pedidos:', err);
    res.status(500).json({ erro: err.message });
  }
}
