require('dotenv').config();
const express = require('express');
const app = express();

const autenticador = require('./routes/autenticador/login');

app.use(express.json());
const port = process.env.PORT;

app.use(autenticador);

app.listen(port, () => {
    console.log(`Aplicação rodando na porta ${port}.`);
});