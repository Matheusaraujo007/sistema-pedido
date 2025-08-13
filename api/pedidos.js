import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const data = await redis.lrange('pedidos', 0, -1); // retorna array de strings
      const pedidos = data.map(item => JSON.parse(item)); // converte para objetos

      res.status(200).json(pedidos); // <=== retorna ARRAY direto
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: err.message });
    }
  } else {
    res.status(405).json({ erro: 'Método não permitido' });
  }
}
