const {validationResult} = require("express-validator") /* Requerimos check de express-validador, body es lo mismo que check */
const fs = require("fs")
const path = require("path");
const bcryptjs = require("bcryptjs")

const {loadUsers, storeUsers, actId} = require("../data/db_module");/* requerimos las funciones asociadas al json */

module.exports = {
    register: (req,res) => {
        res.render("./users/register")
    },
    processRegister: (req,res) => {
        const users = loadUsers();
        let errors = validationResult(req).mapped()/* Traemos los errores en forma de objeto */

        req.fileValidationError ?  errors = {...errors, file :{msg: req.fileValidationError}} : null /* preguntamos y asignamos un mensaje de error en file */

        users.find(oneUser => oneUser["email"] === req.body.email) ?  errors = {...errors, email: {msg: "Este email ya esta registrado"}}:null;/* preguntamos si el email ya esta en la base, si esta mandamos el error */

        if (Object.entries(errors).length > 0) {/* Si hay errores, entra */
            if (req.file) {
                fs.existsSync(path.resolve(__dirname, "..", "..", "public", "images", "users", req.file.filename)) && fs.unlinkSync(path.resolve(__dirname, "..", "..", "public", "images", "users", req.file.filename))/* existsSync busca si existe el archivo y unlinkSync lo elimina */
            }

            return res.render("./users/register", {
                errors, /* mapped convierte un array en objeto */
                oldData: req.body, /* mantendremos los datos ingresador por el usuario */
            })
        }

        const {nombreApellido, nameUsuario,email,fecha,domicilio,uno,electro,moda,hogar,jugueteria,vida,clave} = req.body
        let userToCreate = {
            id: users[users.length - 1].id +1,
            nombreApellido,
            nameUsuario,
            email,
            fecha,
            domicilio,
            perfil: uno ? uno:null,
            intereses: {
                electro: electro,
                moda: moda,
                hogar: hogar,
                jugueteria:jugueteria,
                vida: vida,
            },
            clave: bcryptjs.hashSync(clave, 10),
            avatar: req.file.filename
        }
        let usersModify = [...users, userToCreate]
        storeUsers(usersModify)
        return res.redirect("/users/login")
    },
    login: (req,res) => {
        res.render("./users/login")
    },
    loginProcess: (req,res) => {
        let errors = validationResult(req).mapped()
        const users = loadUsers();
        let userToLogin = users.find(oneUser => oneUser["email"] === req.body.email)/* buscamos si el email es igual a un email de nuestra base de datos */

        if(userToLogin){/* Si el email es identico, entra */
            let isOkTheClave = bcryptjs.compareSync(req.body.clave, userToLogin.clave)/* Comparamos si la clave es igual a la guardada con hash */
            if (isOkTheClave){/* Si la clave es igual, entra */
                delete userToLogin.clave;/* eliminamos la clave */
                req.session.userLogged = userToLogin;/* Guardamos el resto de datos del usuario en session */

                if (req.body.remember_user) {/* preguntamos si marco la opcion de recordar */
                    res.cookie("userEmail", req.body.email, {maxAge: (24000 * 60) * 60})/* implementamos cookie para guardar la sesion del usuario */
                }

                
            }
            return res.render("./users/login",{/* Si la clave es incorrecta, renderizamos con errores */
                errors:{
                    ...errors,
                    email: {
                        msg: "Las credenciales son invalidades"
                    }

                },
                old: req.body
            })
        }

        return res.render("./users/login",{/* Si el email es incorrecto, renderizamos con errores */
            errors:{
                ...errors,
                email: {
                    msg: "No se encuentra este email"
                },
            },
            old: req.body
        })
    },
    profile: (req, res) => {
		return res.render('./users/profile', {
			user: req.session.userLogged/* guardamos los datos del usuario de session */
		});
	},
    logout: (req, res) => {
        res.clearCookie("userEmail")/* borra la cookie para mantener sesion */
        req.session.destroy(); /* borra automaticamente todo registro en session */
		return res.redirect("/");
	},
}