const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Selfit',
            version: '1.0.0',
            description: 'Documentação da API organizada com módulos',
        },
        servers: [
            {
                url: 'http://localhost:3000',
                description: 'Ambiente de Desenvolvimento',
            },        
        ],
    },
    // Busca os comentários nas rotas...
    apis: ['./src/routes/**/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;