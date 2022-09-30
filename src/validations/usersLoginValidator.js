const {check} = require("express-validator") /* Requerimos check de express-validador, body es lo mismo que check */

module.exports = [
    check("email")
        .notEmpty().withMessage("Debe completar el email").bail()/* Bail corta la ejecucion si hay error */
        .isEmail()/* valida si es un correo */.withMessage("Debes escribir un correo valido"),
    check("clave")
        .notEmpty().withMessage("Debe completar la clave").bail()
        .isLength({min: 5}).withMessage("Debe contener al menos 5 caracteres"),
]