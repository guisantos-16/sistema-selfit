const validarAutenticacao = (req, res, next) => {
    const { usuario, senha_hash } = req.body;

    if (!usuario || typeof usuario !== 'string' || usuario.trim() === '') {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'O campo "usuario" é obrigatório e deve ser uma string válida.'
        });
    }

    if (!senha_hash || typeof senha_hash !== 'string' || senha_hash.trim() === '') {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'O campo "senha" é obrigatório e deve ser uma string válida.'
        });
    }

    next();
}

module.exports = validarAutenticacao;