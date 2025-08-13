const express = require('express');
const { createClient } = require('redis');
const path = require('path');
const app = express();
const port = 3000;

// Conexão Redis (substitua pelos dados do seu Redis, ex: Upstash)
const client = createClient({
  url: 'redis-cli --tls -u redis://default:AYYoAAIncDFjYzc4MDdjNTJmZGY0N2YyYjg1MzI2YmQ2YTUwZTZhNHAxMzQzNDQ@joint-sunbird-34344.upstash.io:6379'
});

client.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
  await client.connect();
  console.log('Redis conectado!');
})();

// Para receber JSON do front-end
app.use(express.json());

// Servir o HTML
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Endpoint para salvar pedidos
app.post('/salvar-pedido', async (req, res) => {
  try {
    const pedido = req.body;

    // Gerar um ID único para cada pedido
    const id = Date.now();

    // Salvar no Redis como JSON
    await client.set(`pedido:${id}`, JSON.stringify(pedido));

    res.json({ sucesso: true, id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ sucesso: false, erro: err.message });
  }
});

// Endpoint para listar pedidos
app.get('/pedidos', async (req, res) => {
  try {
    const chaves = await client.keys('pedido:*');
    const pedidos = [];
    for (const chave of chaves) {
      const pedido = await client.get(chave);
      pedidos.push(JSON.parse(pedido));
    }
    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
