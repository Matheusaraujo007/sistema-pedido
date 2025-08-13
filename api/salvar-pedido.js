import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Método não permitido' });

  try {
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
      itens: itens || [],
      dataPedido: dataPedido || '',
      dataEntrega: dataEntrega || '',
      valorTotal: parseFloat(valorTotal) || 0,
      valorRecebido: parseFloat(valorRecebido) || 0,
      status: status || 'Aguardando Retorno'
    };

    // Salva como string JSON no Redis
    await redis.lpush('pedidos', JSON.stringify(pedido));

    res.status(200).json({ sucesso: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: err.message });
  }
}
