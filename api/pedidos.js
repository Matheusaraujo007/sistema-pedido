import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // busca todos os pedidos no Redis
      const pedidosRaw = await redis.lrange('pedidos', 0, -1); 
      const pedidos = pedidosRaw.map(p => {
        try { return JSON.parse(p); }
        catch { return null; }
      }).filter(p => p !== null);

      return res.status(200).json(pedidos);
    }

    if (req.method === 'POST') {
      // código do POST permanece igual
    }

    res.status(405).json({ erro: 'Método não permitido' });

  } catch (err) {
    console.error('Erro na API:', err);
    res.status(500).json({ erro: err.message });
  }
}



export default async function handler(req, res) {
  if (req.method === 'POST') {
    // salva pedido
  } else if (req.method === 'GET') {
    // retorna todos os pedidos
  } else {
    res.status(405).json({ erro: 'Método não permitido' });
  }
}
