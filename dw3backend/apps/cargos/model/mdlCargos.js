const db = require("../../../database/databaseconfig");

const getAllCargos = async () => {
    return (
        await db.query(
            `SELECT * FROM cargos WHERE deleted = false ORDER BY descricao`
        )
    ).rows;
};

const getCargoByID = async (cargoidPar) => {
    return (
        await db.query(
            `SELECT * FROM cargos WHERE cargoid = $1 AND deleted = false`,
            [cargoidPar]
        )
    ).rows;
};

const insertCargo = async (cargoREGPar) => {
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                `INSERT INTO cargos (codigo, descricao, salario_base, ativo) 
                 VALUES ($1, $2, $3, $4)`,
                [
                    cargoREGPar.codigo,
                    cargoREGPar.descricao,
                    cargoREGPar.salario_base,
                    cargoREGPar.ativo,
                ]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlCargos|insertCargo] " + error.detail;
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
};

const updateCargo = async (cargoREGPar) => {
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                `UPDATE cargos SET 
                    codigo = $2, 
                    descricao = $3, 
                    salario_base = $4, 
                    ativo = $5 
                 WHERE cargoid = $1`,
                [
                    cargoREGPar.cargoid,
                    cargoREGPar.codigo,
                    cargoREGPar.descricao,
                    cargoREGPar.salario_base,
                    cargoREGPar.ativo,
                ]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlCargos|updateCargo] " + error.detail;
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
};

const deleteCargo = async (cargoREGPar) => {
    let linhasAfetadas;
    let msg = "ok";
    try {
        linhasAfetadas = (
            await db.query(
                `UPDATE cargos SET deleted = true WHERE cargoid = $1`,
                [cargoREGPar.cargoid]
            )
        ).rowCount;
    } catch (error) {
        msg = "[mdlCargos|deleteCargo] " + error.detail;
        linhasAfetadas = -1;
    }

    return { msg, linhasAfetadas };
};

module.exports = {
    getAllCargos,
    getCargoByID,
    insertCargo,
    updateCargo,
    deleteCargo,
};