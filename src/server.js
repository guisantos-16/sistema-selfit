require('dotenv').config();
const express = require('express');
const app = express();

app.use(express.json());

const autenticador = require('../src/routes/autenticador-usuarios');
app.use(autenticador)

const port = process.env.PORT;

app.listen(port, () => {
    console.log(`Aplicação rodando na porta ${port}.`);
});