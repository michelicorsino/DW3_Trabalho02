const mdlProjetos = require("../model/mdlProjetos");

const getAllProjetos = (req, res) =>
    (async () => {
        let registro = await mdlProjetos.getAllProjetos();
        res.json({ status: "ok", registro: registro });
    })();

const getProjetoByID = (req, res) =>
    (async () => {
        const projetoid = parseInt(req.body.projetoid);
        let registro = await mdlProjetos.getProjetoByID(projetoid);
        res.json({ status: "ok", registro: registro });
    })();

const insertProjeto = (request, res) =>
    (async () => {
        const projetoREG = request.body;
        let { msg, linhasAfetadas } = await mdlProjetos.insertProjeto(projetoREG);
        res.json({ status: msg, linhasAfetadas: linhasAfetadas });
    })();

const updateProjeto = (request, res) =>
    (async () => {
        const projetoREG = request.body;
        let { msg, linhasAfetadas } = await mdlProjetos.updateProjeto(projetoREG);
        res.json({ status: msg, linhasAfetadas: linhasAfetadas });
    })();

const deleteProjeto = (request, res) =>
    (async () => {
        const projetoREG = request.body;
        let { msg, linhasAfetadas } = await mdlProjetos.deleteProjeto(projetoREG);
        res.json({ status: msg, linhasAfetadas: linhasAfetadas });
    })();

module.exports = {
    getAllProjetos,
    getProjetoByID,
    insertProjeto,
    updateProjeto,
    deleteProjeto,
};