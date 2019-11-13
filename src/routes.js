const routes = require('express').Router();
const sessionController = require("../src/app/controllers/SessionController");

// Definição Rotas


routes.post("/sessions" , sessionController.store);

module.exports = routes;