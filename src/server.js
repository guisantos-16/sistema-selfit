require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT;

app.use(cors({
    origin: process.env.FRONT
}));

app.use(express.json());

const autenticador = require('../src/routes/autenticador-usuarios');
const cadastro = require('../src/routes/cadastro');

// Equipamentos
const painelEquipamentos = require('./routes/equipamentos/painel-principal');

app.use(autenticador);
app.use(cadastro);

// Equipamentos
app.use(painelEquipamentos);

app.listen(port, () => {
    console.log(`Aplicação rodando na porta ${port}.`);
});