import { Redis } from '@upstash/redis';

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error("Variáveis de ambiente UPSTASH_REDIS_REST_URL e UPSTASH_REDIS_REST_TOKEN não configuradas");
}

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  try {
    console.log("Request recebida:", req.method);

    if (req.method === 'GET') {
      console.log("Buscando pedidos no Redis...");
      const pedidosRaw = await redis.lrange('pedidos', 0, -1);
      console.log("Pedidos crus:", pedidosRaw);

      const pedidos = pedidosRaw
        .map(p => { try { return JSON.parse(p); } catch { return null; } })
        .filter(Boolean);

      console.log(`Pedidos processados: ${pedidos.length}`);
      return res.status(200).json(pedidos);
    }

    res.status(405).json({ erro: 'Método não permitido' });

  } catch (err) {
    console.error("Erro na API:", err);
    res.status(500).json({ erro: err.message });
  }
}
