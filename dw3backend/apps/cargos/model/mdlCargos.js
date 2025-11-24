const db = require("../../../database/databaseconfig");

const getAllCargos = async () => {
    return (
        await db.query(
            `SELECT c.*, 
             (SELECT COALESCE(json_agg(cs.setorid), '[]') 
              FROM cargos_setores cs 
              WHERE cs.cargoid = c.cargoid) as setores_ids
             FROM cargos c 
             WHERE c.deleted = false 
             ORDER BY c.descricao`
        )
    ).rows;
};

const getCargoByID = async (cargoidPar) => {
    return (
        await db.query(
            `SELECT c.*, 
             (SELECT COALESCE(json_agg(cs.setorid), '[]') 
              FROM cargos_setores cs 
              WHERE cs.cargoid = c.cargoid) as setores_ids
             FROM cargos c 
             WHERE c.cargoid = $1 AND c.deleted = false`,
            [cargoidPar]
        )
    ).rows;
};

const insertCargo = async (cargoREGPar) => {
    let linhasAfetadas;
    let msg = "ok";
    try {
        // 1. Inicia inserção do Cargo e pede para retornar o ID gerado
        const result = await db.query(
            `INSERT INTO cargos (codigo, descricao, salario_base, ativo) 
             VALUES ($1, $2, $3, $4) 
             RETURNING cargoid`,
            [
                cargoREGPar.codigo,
                cargoREGPar.descricao,
                cargoREGPar.salario_base,
                cargoREGPar.ativo,
            ]
        );
        
        // Pega o ID do novo cargo
        const novoCargoID = result.rows[0].cargoid;
        linhasAfetadas = result.rowCount;

        // 2. Se tiver setores, insere na tabela de ligação
        if (cargoREGPar.setoresIds && cargoREGPar.setoresIds.length > 0) {
            for (const setorId of cargoREGPar.setoresIds) {
                await db.query(
                    `INSERT INTO cargos_setores (cargoid, setorid) VALUES ($1, $2)`,
                    [novoCargoID, setorId]
                );
            }
        }

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
        // 1. Atualiza os dados básicos
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

        // 2. Atualiza os setores (Apaga todos antigos e insere os novos)
        // Isso evita ter que verificar um por um qual mudou
        await db.query(`DELETE FROM cargos_setores WHERE cargoid = $1`, [cargoREGPar.cargoid]);

        if (cargoREGPar.setoresIds && cargoREGPar.setoresIds.length > 0) {
            for (const setorId of cargoREGPar.setoresIds) {
                await db.query(
                    `INSERT INTO cargos_setores (cargoid, setorid) VALUES ($1, $2)`,
                    [cargoREGPar.cargoid, setorId]
                );
            }
        }

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