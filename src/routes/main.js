// ************ Require's ************
const express = require('express');
const router = express.Router();

// ************ Controller Require ************
const mainController = require('../controllers/mainController');

// ************ Middlewares Require ************
const colorValidator = require("../validations/colorsValidator")
const guestColorMiddleware = require("../middlewares/MD-Color/guestColorMD")/* Middleware para no permitir ingresar a vistas si estamos logueado */
const authColorMiddleware = require("../middlewares/MD-Color/authColorMD")/* Middleware para no permitir ingresar a vistas si no estamos logueado en color*/

router.get('/', mainController.index); /* Ruta principal */
router.get('/search', mainController.search); /* Ruta del buscador ubicado en header */
router.get('/color', guestColorMiddleware, mainController.color);
router.post('/color', colorValidator, mainController.colorPost);
router.get('/gracias', mainController.graciass);
router.get('/chau', authColorMiddleware, mainController.chau);

module.exports = router;
