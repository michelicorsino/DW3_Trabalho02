const db = require("../../../database/databaseconfig");

const getAllSetores = async () => {
    return (
        await db.query(
            `SELECT * FROM setores WHERE deleted = false ORDER BY nome`
        )
    ).rows;
};

const getSetorByID = async (setoridPar) => {
    return (
        await db.query(
            `SELECT * FROM setores WHERE setorid = $1 AND deleted = false`,
            [setoridPar]
        )
    ).rows;
};

const insertSetor = async (setorREGPar) => {
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                `INSERT INTO setores (codigo, nome, andar, ativo) 
                 VALUES ($1, $2, $3, $4)`,
                [
                    setorREGPar.codigo,
                    setorREGPar.nome,
                    setorREGPar.andar,
                    setorREGPar.ativo,
                ]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlSetores|insertSetor] " + error.detail;
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
};

const updateSetor = async (setorREGPar) => {
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                `UPDATE setores SET 
                    codigo = $2, 
                    nome = $3, 
                    andar = $4, 
                    ativo = $5 
                 WHERE setorid = $1`,
                [
                    setorREGPar.setorid,
                    setorREGPar.codigo,
                    setorREGPar.nome,
                    setorREGPar.andar,
                    setorREGPar.ativo,
                ]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlSetores|updateSetor] " + error.detail;
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
};

const deleteSetor = async (setorREGPar) => {
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                `UPDATE setores SET deleted = true WHERE setorid = $1`,
                [setorREGPar.setorid]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlSetores|deleteSetor] " + error.detail;
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
};

module.exports = {
    getAllSetores,
    getSetorByID,
    insertSetor,
    updateSetor,
    deleteSetor,
};