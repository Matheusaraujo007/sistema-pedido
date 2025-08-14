// server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB
const client = new MongoClient(process.env.MONGO_URI);
let db;

async function conectarMongo() {
  try {
    await client.connect();
    db = client.db(); // usa o nome do DB da URI
    console.log("Conectado ao MongoDB Atlas!");
  } catch (err) {
    console.error("Erro ao conectar no MongoDB:", err);
  }
}
await conectarMongo();

// Serve arquivos estáticos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(__dirname));

// Rotas

// POST - Criar pedido
app.post('/api/pedidos', async (req, res) => {
  try {
    const pedido = req.body;
    const result = await db.collection('pedidos').insertOne(pedido);
    res.status(200).json({ sucesso: true, id: result.insertedId });
  } catch (err) {
    console.error("Erro ao criar pedido:", err);
    res.status(500).json({ erro: err.message });
  }
});

// GET - Listar pedidos
app.get('/api/pedidos', async (req, res) => {
  try {
    const pedidos = await db.collection('pedidos').find().toArray();
    res.status(200).json(pedidos);
  } catch (err) {
    console.error("Erro ao buscar pedidos:", err);
    res.status(500).json({ erro: err.message });
  }
});

// Teste de servidor
app.get('/api/test', (req, res) => {
  res.json({ status: "Servidor rodando e MongoDB conectado" });
});

// Inicia servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
