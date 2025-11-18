const mdlSetores = require("../model/mdlSetores");

const getAllSetores = (req, res) =>
    (async () => {
        let registro = await mdlSetores.getAllSetores();
        res.json({ status: "ok", registro: registro });
    })();

const getSetorByID = (req, res) =>
    (async () => {
        const setorid = parseInt(req.body.setorid);
        let registro = await mdlSetores.getSetorByID(setorid);
        res.json({ status: "ok", registro: registro });
    })();

const insertSetor = (request, res) =>
    (async () => {
        const setorREG = request.body;
        let { msg, linhasAfetadas } = await mdlSetores.insertSetor(setorREG);
        res.json({ status: msg, linhasAfetadas: linhasAfetadas });
    })();

const updateSetor = (request, res) =>
    (async () => {
        const setorREG = request.body;
        let { msg, linhasAfetadas } = await mdlSetores.updateSetor(setorREG);
        res.json({ status: msg, linhasAfetadas: linhasAfetadas });
    })();

const deleteSetor = (request, res) =>
    (async () => {
        const setorREG = request.body;
        let { msg, linhasAfetadas } = await mdlSetores.deleteSetor(setorREG);
        res.json({ status: msg, linhasAfetadas: linhasAfetadas });
    })();

module.exports = {
    getAllSetores,
    getSetorByID,
    insertSetor,
    updateSetor,
    deleteSetor,
};