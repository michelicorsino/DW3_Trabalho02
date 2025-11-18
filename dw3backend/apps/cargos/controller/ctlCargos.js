const mdlCargos = require("../model/mdlCargos");

const getAllCargos = (req, res) =>
    (async () => {
        let registro = await mdlCargos.getAllCargos();
        res.json({ status: "ok", registro: registro });
    })();

const getCargoByID = (req, res) =>
    (async () => {
        const cargoid = parseInt(req.body.cargoid);
        let registro = await mdlCargos.getCargoByID(cargoid);
        res.json({ status: "ok", registro: registro });
    })();

const insertCargo = (request, res) =>
    (async () => {
        const cargoREG = request.body;
        let { msg, linhasAfetadas } = await mdlCargos.insertCargo(cargoREG);
        res.json({ status: msg, linhasAfetadas: linhasAfetadas });
    })();

const updateCargo = (request, res) =>
    (async () => {
        const cargoREG = request.body;
        let { msg, linhasAfetadas } = await mdlCargos.updateCargo(cargoREG);
        res.json({ status: msg, linhasAfetadas: linhasAfetadas });
    })();

const deleteCargo = (request, res) =>
    (async () => {
        const cargoREG = request.body;
        let { msg, linhasAfetadas } = await mdlCargos.deleteCargo(cargoREG);
        res.json({ status: msg, linhasAfetadas: linhasAfetadas });
    })();

module.exports = {
    getAllCargos,
    getCargoByID,
    insertCargo,
    updateCargo,
    deleteCargo,
};