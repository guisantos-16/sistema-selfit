require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors({
    origin: process.env.FRONT
}));

app.use(express.json());

const autenticador = require('../src/routes/autenticador-usuarios');
app.use(autenticador)

const cadastro = require('../src/routes/cadastro');
app.use(cadastro);

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Aplicação rodando na porta ${port}.`);
});