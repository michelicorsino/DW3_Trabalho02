const jwt = require("jsonwebtoken");
const bCrypt = require("bcryptjs");
const mdlLogin = require("../model/mdlLogin");

//Busca no banco o usuário digitado
const Login = async (req, res, next) => {
 const credencial = await mdlLogin.GetCredencial(req.body.username);
 
 //Verifica se o usuário existe
 if (credencial.length == 0) {
  return res.status(401).json({ message: "Usuário não identificado!" });
 }

 //Compara a senha
 if (bCrypt.compareSync(req.body.password, credencial[0].password)) {

  const username = credencial[0].username;
  
  const id = credencial[0].usuarioid; 

  const token = jwt.sign({ id, username }, process.env.SECRET_API, {
   expiresIn: 600, 
  });

  //Retorna sucesso e o token
  return res.json({ auth: true, token: token, username: username });
 }

//Tratamento caso a senha esteja errada
 res.status(401).json({ message: "Login inválido!" });
};

//verifica se o token JWT é válido antes de permitir o acesso a rotas protegidas.
function AutenticaJWT(req, res, next) {
 const tokenHeader = req.headers["authorization"];

 if (!tokenHeader)
  return res
   .status(401) 
   .json({ auth: false, message: "Não foi informado o token JWT" });

 const bearer = tokenHeader.split(" ");
 const token = bearer[1];

 //Verifica se o token é válido
 jwt.verify(token, process.env.SECRET_API, function (err, decoded) {
  if (err)
   return res
    .status(401)
    .json({ auth: false, message: "JWT inválido ou expirado" });

  //Guarda dados do usuário na requisição  
  req.userId = decoded.id; 
    req.username = decoded.username; 
  next();
 });
}

//Função de Logout, encerra sessão
const Logout = (req, res, next) => {
 res.json({ auth: false, token: null });
};

module.exports = {
 Login,
 Logout,
 AutenticaJWT,
};