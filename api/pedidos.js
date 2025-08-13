import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const pedidos = await redis.lrange('pedidos', 0, -1); // retorna array de strings
      const pedidosJSON = pedidos.map(p => JSON.parse(p)); // transforma em objetos
      res.status(200).json(pedidosJSON); // envia como array
    } catch (err) {
      res.status(500).json({ erro: err.message }); // aqui é objeto, não array
    }
  } else {
    res.status(405).json({ erro: 'Método não permitido' });
  }
}
