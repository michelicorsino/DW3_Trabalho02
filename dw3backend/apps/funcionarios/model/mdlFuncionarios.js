const db = require("../../../database/databaseconfig");

const getAllFuncionarios = async () => {
    return (
        await db.query(
            `SELECT f.*, c.descricao as cargo_descricao, s.nome as setor_nome
             FROM funcionarios f
             INNER JOIN cargos c ON f.cargoid = c.cargoid
             INNER JOIN setores s ON f.setorid = s.setorid
             WHERE f.deleted = false 
             ORDER BY f.nome`
        )
    ).rows;
};

const getFuncionarioByID = async (funcionarioidPar) => {
    return (
        await db.query(
            `SELECT f.*, c.descricao as cargo_descricao, s.nome as setor_nome
             FROM funcionarios f
             INNER JOIN cargos c ON f.cargoid = c.cargoid
             INNER JOIN setores s ON f.setorid = s.setorid
             WHERE f.funcionarioid = $1 AND f.deleted = false`,
            [funcionarioidPar]
        )
    ).rows;
};

const insertFuncionario = async (funcionarioREGPar) => {
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                `INSERT INTO funcionarios 
                 (matricula, nome, cpf, email, telefone, datanascimento, dataadmissao, salario, cargoid, setorid) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
                [
                    funcionarioREGPar.matricula,
                    funcionarioREGPar.nome,
                    funcionarioREGPar.cpf,
                    funcionarioREGPar.email,
                    funcionarioREGPar.telefone,
                    funcionarioREGPar.datanascimento,
                    funcionarioREGPar.dataadmissao,
                    funcionarioREGPar.salario,
                    funcionarioREGPar.cargoid,
                    funcionarioREGPar.setorid,
                ]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlFuncionarios|insertFuncionario] " + error.detail;
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
};

const updateFuncionario = async (funcionarioREGPar) => {
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                `UPDATE funcionarios SET 
                    matricula = $2, 
                    nome = $3, 
                    cpf = $4,
                    email = $5,
                    telefone = $6,
                    datanascimento = $7,
                    dataadmissao = $8,
                    salario = $9,
                    cargoid = $10,
                    setorid = $11
                 WHERE funcionarioid = $1`,
                [
                    funcionarioREGPar.funcionarioid,
                    funcionarioREGPar.matricula,
                    funcionarioREGPar.nome,
                    funcionarioREGPar.cpf,
                    funcionarioREGPar.email,
                    funcionarioREGPar.telefone,
                    funcionarioREGPar.datanascimento,
                    funcionarioREGPar.dataadmissao,
                    funcionarioREGPar.salario,
                    funcionarioREGPar.cargoid,
                    funcionarioREGPar.setorid,
                ]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlFuncionarios|updateFuncionario] " + error.detail;
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
};

const deleteFuncionario = async (funcionarioREGPar) => {
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                `UPDATE funcionarios SET deleted = true WHERE funcionarioid = $1`,
                [funcionarioREGPar.funcionarioid]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlFuncionarios|deleteFuncionario] " + error.detail;
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
};

// Funções para o relacionamento N:N com Projetos // Micheli 
const getFuncionariosProjeto = async (projetoidPar) => {
    return (
        await db.query(
            `SELECT f.*, fp.papel, fp.horasalocadas, fp.dataatribuicao
             FROM funcionarios_projetos fp
             INNER JOIN funcionarios f ON fp.funcionarioid = f.funcionarioid
             WHERE fp.projetoid = $1 AND fp.deleted = false
             ORDER BY f.nome`,
            [projetoidPar]
        )
    ).rows;
};

const alocaFuncionarioProjeto = async (alocacaoREGPar) => {
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                `INSERT INTO funcionarios_projetos 
                 (funcionarioid, projetoid, dataatribuicao, papel, horasalocadas) 
                 VALUES ($1, $2, $3, $4, $5)`,
                [
                    alocacaoREGPar.funcionarioid,
                    alocacaoREGPar.projetoid,
                    alocacaoREGPar.dataatribuicao,
                    alocacaoREGPar.papel,
                    alocacaoREGPar.horasalocadas,
                ]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlFuncionarios|alocaFuncionarioProjeto] " + error.detail;
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
};

const removeFuncionarioProjeto = async (funcionarioidPar, projetoidPar) => {
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                `UPDATE funcionarios_projetos SET deleted = true 
                 WHERE funcionarioid = $1 AND projetoid = $2`,
                [funcionarioidPar, projetoidPar]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlFuncionarios|removeFuncionarioProjeto] " + error.detail;
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
};

module.exports = {
    getAllFuncionarios,
    getFuncionarioByID,
    insertFuncionario,
    updateFuncionario,
    deleteFuncionario,
    getFuncionariosProjeto,
    alocaFuncionarioProjeto,
    removeFuncionarioProjeto,
};