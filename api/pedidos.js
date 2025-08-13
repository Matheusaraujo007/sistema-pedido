import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  try {
    // Busca os pedidos no Redis (chave: "pedidos")
    const pedidos = await redis.get('pedidos');

    // Se não existir nada, retorna array vazio
    if (!pedidos) return res.status(200).json([]);

    // Converte string JSON em array (caso tenha sido salvo como JSON)
    const pedidosArray = Array.isArray(pedidos) ? pedidos : JSON.parse(pedidos);

    // Retorna para o front
    res.status(200).json(pedidosArray);
  } catch (err) {
    console.error('Erro ao buscar pedidos:', err);
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
}
