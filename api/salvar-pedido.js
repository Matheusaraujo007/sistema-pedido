import Redis from '@upstash/redis';

const redis = Redis.fromEnv(); // Ou inicialize com sua URL e TOKEN

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const pedido = req.body;

            // Salva o pedido como JSON na lista "pedidos"
            await redis.lpush('pedidos', JSON.stringify(pedido));

            res.status(200).json({ sucesso: true });
        } catch (err) {
            res.status(500).json({ erro: err.message });
        }
    } else {
        res.status(405).json({ erro: 'Método não permitido' });
    }
}
