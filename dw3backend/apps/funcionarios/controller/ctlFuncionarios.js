const mdlFuncionarios = require("../model/mdlFuncionarios");

const getAllFuncionarios = (req, res) =>
    (async () => {
        let registro = await mdlFuncionarios.getAllFuncionarios();
        res.json({ status: "ok", registro: registro });
    })();

const getFuncionarioByID = (req, res) =>
    (async () => {
        const funcionarioid = parseInt(req.body.funcionarioid);
        let registro = await mdlFuncionarios.getFuncionarioByID(funcionarioid);
        res.json({ status: "ok", registro: registro });
    })();

const insertFuncionario = (request, res) =>
    (async () => {
        const funcionarioREG = request.body;
        let { msg, linhasAfetadas } = await mdlFuncionarios.insertFuncionario(funcionarioREG);
        res.json({ status: msg, linhasAfetadas: linhasAfetadas });
    })();

const updateFuncionario = (request, res) =>
    (async () => {
        const funcionarioREG = request.body;
        let { msg, linhasAfetadas } = await mdlFuncionarios.updateFuncionario(funcionarioREG);
        res.json({ status: msg, linhasAfetadas: linhasAfetadas });
    })();

const deleteFuncionario = (request, res) =>
    (async () => {
        const funcionarioREG = request.body;
        let { msg, linhasAfetadas } = await mdlFuncionarios.deleteFuncionario(funcionarioREG);
        res.json({ status: msg, linhasAfetadas: linhasAfetadas });
    })();

const getFuncionariosProjeto = (req, res) =>
    (async () => {
        const projetoid = parseInt(req.params.projetoid);
        let registro = await mdlFuncionarios.getFuncionariosProjeto(projetoid);
        res.json({ status: "ok", registro: registro });
    })();

const alocaFuncionarioProjeto = (request, res) =>
    (async () => {
        const alocacaoREG = request.body;
        let { msg, linhasAfetadas } = await mdlFuncionarios.alocaFuncionarioProjeto(alocacaoREG);
        res.json({ status: msg, linhasAfetadas: linhasAfetadas });
    })();

const removeFuncionarioProjeto = (request, res) =>
    (async () => {
        const { funcionarioid, projetoid } = request.body;
        let { msg, linhasAfetadas } = await mdlFuncionarios.removeFuncionarioProjeto(
            funcionarioid, 
            projetoid
        );
        res.json({ status: msg, linhasAfetadas: linhasAfetadas });
    })();

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