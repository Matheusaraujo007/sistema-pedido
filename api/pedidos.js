import 'dotenv/config';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  try {
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

      // salva pedido no Redis
      await redis.lpush('pedidos', JSON.stringify(pedido));

      // retorna quantidade atual de pedidos
      const total = await redis.llen('pedidos');

      console.log("Pedido adicionado:", pedido);
      console.log("Total de pedidos:", total);

      return res.status(200).json({ sucesso: true, totalPedidos: total });
    }

    if (req.method === 'GET') {
      const pedidosRaw = await redis.lrange('pedidos', 0, -1);

      const pedidos = pedidosRaw
        .map(p => {
          try { return JSON.parse(p); }
          catch (e) { return null; }
        })
        .filter(Boolean)
        .reverse(); // do mais antigo para o mais recente

      console.log("Pedidos retornados:", pedidos.length);

      return res.status(200).json(pedidos);
    }

    res.status(405).json({ erro: 'Método não permitido' });
  } catch (err) {
    console.error('Erro na API:', err);
    res.status(500).json({ erro: err.message });
  }
}
