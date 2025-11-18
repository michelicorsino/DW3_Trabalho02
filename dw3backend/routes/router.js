const express = require("express");
const routerApp = express.Router();

const appLogin = require("../apps/login/controller/ctlLogin");
const appCargos = require("../apps/cargos/controller/ctlCargos");
const appSetores = require("../apps/setores/controller/ctlSetores");
const appFuncionarios = require("../apps/funcionarios/controller/ctlFuncionarios");
const appProjetos = require("../apps/projetos/controller/ctlProjetos");

// Middleware
routerApp.use((req, res, next) => {
    next();
});

routerApp.get("/", (req, res) => {
    res.send("Olá mundo!");
});

// Rotas de Login
routerApp.post("/Login", appLogin.Login);
routerApp.post("/Logout", appLogin.Logout);

// Rotas de Cargos
routerApp.get("/getAllCargos", appCargos.getAllCargos);
routerApp.post("/getCargoByID", appLogin.AutenticaJWT, appCargos.getCargoByID);
routerApp.post("/insertCargo", appLogin.AutenticaJWT, appCargos.insertCargo);
routerApp.post("/updateCargo", appLogin.AutenticaJWT, appCargos.updateCargo);
routerApp.post("/deleteCargo", appLogin.AutenticaJWT, appCargos.deleteCargo);

// Rotas de Setores
routerApp.get("/getAllSetores", appSetores.getAllSetores);
routerApp.post("/getSetorByID", appLogin.AutenticaJWT, appSetores.getSetorByID);
routerApp.post("/insertSetor", appLogin.AutenticaJWT, appSetores.insertSetor);
routerApp.post("/updateSetor", appLogin.AutenticaJWT, appSetores.updateSetor);
routerApp.post("/deleteSetor", appLogin.AutenticaJWT, appSetores.deleteSetor);

//Rotas de Funcionários
routerApp.get("/getAllFuncionarios", appFuncionarios.getAllFuncionarios);
routerApp.post("/getFuncionarioByID", appLogin.AutenticaJWT, appFuncionarios.getFuncionarioByID);
routerApp.post("/insertFuncionario", appLogin.AutenticaJWT, appFuncionarios.insertFuncionario);
routerApp.post("/updateFuncionario", appLogin.AutenticaJWT, appFuncionarios.updateFuncionario);
routerApp.post("/deleteFuncionario", appLogin.AutenticaJWT, appFuncionarios.deleteFuncionario);

// Rotas de Projetos
routerApp.get("/getAllProjetos", appProjetos.getAllProjetos);
routerApp.post("/getProjetoByID", appLogin.AutenticaJWT, appProjetos.getProjetoByID);
routerApp.post("/insertProjeto", appLogin.AutenticaJWT, appProjetos.insertProjeto);
routerApp.post("/updateProjeto", appLogin.AutenticaJWT, appProjetos.updateProjeto);
routerApp.post("/deleteProjeto", appLogin.AutenticaJWT, appProjetos.deleteProjeto);

// Rotas de Alocação (Funcionários x Projetos) - Tabela originária do relacionamento N:N
routerApp.get("/getFuncionariosProjeto/:projetoid", appFuncionarios.getFuncionariosProjeto);
routerApp.post("/alocaFuncionarioProjeto", appLogin.AutenticaJWT, appFuncionarios.alocaFuncionarioProjeto);
routerApp.post("/removeFuncionarioProjeto", appLogin.AutenticaJWT, appFuncionarios.removeFuncionarioProjeto);

module.exports = routerApp;