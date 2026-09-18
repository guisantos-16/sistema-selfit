require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const port = process.env.PORT;

app.use(cors({
    origin: process.env.FRONT
}));

app.use(express.json());

if (process.env.NODE_ENV !== 'production') {
    const swaggerUi = require('swagger-ui-express');
    const swaggerSpec = require('./docs/swaggerConfig');

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log('Documentação disponível em /api-docs (Ambiente de Desenvolvimento)');
}

const autenticador = require('./routes/autenticador-usuarios');
const cadastro = require('./routes/cadastro');

app.use(autenticador);
app.use(cadastro);

app.listen(port, () => {
    console.log(`Aplicação rodando na porta ${port}.`);
});