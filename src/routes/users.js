// ************ Require's ************
const express = require('express');
const router = express.Router();

// ************ Controller Require ************
const {login,register,processRegister, loginProcess, profile, logout} = require('../controllers/usersController');

// ************ Middleware Require ************
const {uploadUsers} = require("../middlewares/uploadFiles")
const validacionesRegister = require("../validations/usersRegisterValidator")
const validacionesLogin = require("../validations/usersLoginValidator")
const guestMiddleware = require("../middlewares/MD-Users/guestMiddleware")/* Middleware para no permitir ingresar a vistas si estamos logueado */
const authMiddleware = require("../middlewares/MD-Users/authMiddleware")/* Middleware para no permitir ingresar a vistas si no estamos logueado */

router
    .get('/register',guestMiddleware, register)
    .post('/register', uploadUsers.single("file"), validacionesRegister, processRegister)
    .get('/login', guestMiddleware, login)
    .post('/login', validacionesLogin, loginProcess)
    .get("/profile", authMiddleware, profile)
    .get("/logout", authMiddleware, logout)

module.exports = router;