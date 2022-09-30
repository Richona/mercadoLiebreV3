const {check} = require("express-validator")

module.exports = [
    check("nombre")
        .notEmpty().withMessage("El nombre es obligatorio").bail()
        .isLength({min: 3}).withMessage("Debe contener al menos 3 caracteres").bail(),
    check("email")
        .notEmpty().withMessage("El email es obligatorio").bail()
        .isEmail().withMessage("Debe ser un email valido"),
    check("edad")
        .isNumeric({no_symbols : true,}).withMessage('Debe ser un número entero positivo'),
]