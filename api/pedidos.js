import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  try {
    // =========================
    // POST - adicionar pedido
    // =========================
    if (req.method === 'POST') {
      const {
        vendedor,
        nomeCliente,
        telefoneCliente,
        itens,
        dataPedido,
        dataEntrega,
        valorTotal,
        valorRecebido,
        status
      } = req.body;

      const pedido = {
        vendedor: vendedor || 'Não informado',
        nomeCliente: nomeCliente || 'Não informado',
        telefoneCliente: telefoneCliente || 'Não informado',
        itens: Array.isArray(itens) ? itens : [],
        dataPedido: dataPedido || '',
        dataEntrega: dataEntrega || '',
        valorTotal: parseFloat(valorTotal) || 0,
        valorRecebido: parseFloat(valorRecebido) || 0,
        status: status || 'Aguardando Retorno'
      };

      await redis.lpush('pedidos', JSON.stringify(pedido));
      console.log("Pedido adicionado:", pedido);
      return res.status(200).json({ sucesso: true });
    }

    // =========================
    // GET - buscar pedidos
    // =========================
    if (req.method === 'GET') {
      console.log("Buscando pedidos...");
      const pedidosRaw = await redis.lrange('pedidos', 0, -1);
      console.log("Pedidos crus do Redis:", pedidosRaw);

      const pedidos = pedidosRaw
        .map(p => {
          try {
            return JSON.parse(p);
          } catch (e) {
            console.error("Erro ao parsear pedido:", p, e);
            return null;
          }
        })
        .filter(Boolean)
        .reverse(); // Inverte a ordem para do mais antigo ao mais recente

      return res.status(200).json(pedidos);
    }

    // =========================
    // Método não permitido
    // =========================
    res.status(405).json({ erro: 'Método não permitido' });

  } catch (err) {
    console.error('Erro na API:', err);
    res.status(500).json({ erro: err.message });
  }
}
