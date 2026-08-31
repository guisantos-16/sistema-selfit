const express = require('express');
const router = express.Router();

// Em desenvolvimento...

router.post('/auth', (req, res) => {
    const { usuario, senha } = req.body;

    if (!usuario || !senha) {
        res.status(400).json({
            message: 'Campos vazios.'
        });
    }
});