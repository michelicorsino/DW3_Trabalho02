const db = require("../../../database/databaseconfig");

const getAllProjetos = async () => {
    return (
        await db.query(
            `SELECT * FROM projetos WHERE deleted = false ORDER BY nome`
        )
    ).rows;
};

const getProjetoByID = async (projetoidPar) => {
    return (
        await db.query(
            `SELECT * FROM projetos WHERE projetoid = $1 AND deleted = false`,
            [projetoidPar]
        )
    ).rows;
};

const insertProjeto = async (projetoREGPar) => {
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                `INSERT INTO projetos (codigo, nome, descricao, datainicio, datafim, status, orcamento) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [
                    projetoREGPar.codigo,
                    projetoREGPar.nome,
                    projetoREGPar.descricao,
                    projetoREGPar.datainicio,
                    projetoREGPar.datafim,
                    projetoREGPar.status,
                    projetoREGPar.orcamento,
                ]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlProjetos|insertProjeto] " + error.detail;
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
};

const updateProjeto = async (projetoREGPar) => {
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                `UPDATE projetos SET 
                    codigo = $2, 
                    nome = $3, 
                    descricao = $4, 
                    datainicio = $5,
                    datafim = $6,
                    status = $7,
                    orcamento = $8
                 WHERE projetoid = $1`,
                [
                    projetoREGPar.projetoid,
                    projetoREGPar.codigo,
                    projetoREGPar.nome,
                    projetoREGPar.descricao,
                    projetoREGPar.datainicio,
                    projetoREGPar.datafim,
                    projetoREGPar.status,
                    projetoREGPar.orcamento,
                ]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlProjetos|updateProjeto] " + error.detail;
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
};

const deleteProjeto = async (projetoREGPar) => {
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                `UPDATE projetos SET deleted = true WHERE projetoid = $1`,
                [projetoREGPar.projetoid]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlProjetos|deleteProjeto] " + error.detail;
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
};

module.exports = {
    getAllProjetos,
    getProjetoByID,
    insertProjeto,
    updateProjeto,
    deleteProjeto,
};