const routes = require('express').Router();
const sessionController = require("./app/controllers/SessionController");
const authMiddleware = require("./app/middleware/auth");

// Definição Rotas
routes.post("/sessions" , sessionController.store);

// Aplicando Validação do Middleware para as rotas abaixo
routes.use(authMiddleware);

routes.get("/dashboard" , (req , res) => res.status(200).send());

module.exports = routes;