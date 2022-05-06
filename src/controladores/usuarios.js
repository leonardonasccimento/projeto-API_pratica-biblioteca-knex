const knex = require('../conexao');
const bcrypt = require('bcrypt');

const cadastrarUsuario = async (req, res) => {
    const { nome, email, senha, nome_loja } = req.body;

    if (!nome) {
        return res.status(404).json("O campo nome é obrigatório");
    }

    if (!email) {
        return res.status(404).json("O campo email é obrigatório");
    }

    if (!senha) {
        return res.status(404).json("O campo senha é obrigatório");
    }

    if (!nome_loja) {
        return res.status(404).json("O campo nome_loja é obrigatório");
    }

    try {
        const emailExiste=await knex('usuarios').where('email', email);
        
        if (emailExiste.length > 0) {
            return res.status(400).json("O email já existe");
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const usuarioInserido=await knex('usuarios')
        .insert({
            nome,
            email,
            senha: senhaCriptografada,
            nome_loja
        })
        .returning('*');

        if (usuarioInserido.length === 0) {
            return res.status(400).json("O usuário não foi cadastrado.");
        }

        return res.status(200).json("O usuário foi cadastrado com sucesso!");
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const obterPerfil = async (req, res) => {
    const {usuario}=req;

    try {
        return res.status(200).json(usuario);
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

const atualizarPerfil = async (req, res) => {
    const { nome, email, senha, nome_loja } = req.body;
    const {usuario}=req;

    if (!nome && !email && !senha && !nome_loja) {
        return res.status(404).json('É obrigatório informar ao menos um campo para atualização');
    }

    try {
        const emailExiste=await knex('usuarios').where('email', email);
        
        if (emailExiste.length > 0 && usuario.email!==email) {
            return res.status(400).json("Este E-mail já está sendo utilizado, informe um E-mail diferente");
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const usuarioAtualizado=await knex('usuarios')
        .update({
            nome,
            email,
            senha: senhaCriptografada,
            nome_loja
        })
        .where({id: usuario.id})
        .returning('*');

        if (usuarioAtualizado.length === 0) {
            return res.status(400).json("O usuário não foi atualizado.");
        }

        return res.status(200).json("O usuário foi atualizado com sucesso!");
    } catch (error) {
        return res.status(400).json(error.message);
    }
}

module.exports = {
    cadastrarUsuario,
    obterPerfil,
    atualizarPerfil
}