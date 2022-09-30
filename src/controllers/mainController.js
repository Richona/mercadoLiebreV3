/* ************REQUIRE´S************ */
const { loadProducts } = require("../data/db_module")/* requerimos las funciones asociadas al json */
const { validationResult } = require("express-validator")


const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");/* Recibe un numero y separa con punto los miles */

const controller = {
	index: (req, res) => {/* METODO GET VISTA PRINCIPAL / */
		const products = loadProducts();/* cargamos los productos */
		const productsVisited = products.filter(product => product.category === "visited");/* Filtramos productos con categoria visited */
		const productsInSale = products.filter(product => product.category === "in-sale");/* Filtramos productos con categoria in-sale */
		return res.render("./main/index", {/* Renderizamos, y mandamos productos visitados y en oferta, con la funcion que separa en punto */
			productsVisited,
			productsInSale,
			toThousand
		})
	},
	search: (req, res) => { /* METODO GET DEL BUSCADOR DE HEADER /search */
		const products = loadProducts();/* cargamos los productos */
		let result = [];
		let rest = [];
		products.forEach(product => {/* recorremos todos los productos */
			product.name.toLowerCase().includes(req.query.keywords.toLowerCase()) ? result.push(product) : rest.push(product);/* Si lo buscado por el usuario (keywords) es parecido al nombre de un producto, se pushea a result, sino va a rest*/
		})
		return res.render("./main/results", {/* Renderizamos, y mandamos los nombres de productos parecidos a lo pedido por usuario, y los que no son parecidos. Ademas, mandamos el pedido del usuario, y la funcion que separa por miles */
			result,
			rest,
			keywords: req.query.keywords,
			toThousand
		})
	},
	color: (req, res) => { /* METODO GET DEL BUSCADOR DE HEADER /search */
		return res.render("./main/colors")
	},
	colorPost: (req, res) => {
		let errors = validationResult(req).mapped()

		if (Object.entries(errors).length === 0) {
			req.session.colorLogged = req.body.color

			if (req.body.remember_color) {/* preguntamos si marco la opcion de recordar */
				res.cookie("color", req.body.color, { maxAge: (24000 * 60) * 60 })/* implementamos cookie para guardar la sesion del usuario */
			}
			return res.render("./main/colors", {
				user: req.body
			})
		}
		return res.render("./main/colors", {
			errors,
			old: req.body
		})
	},
	graciass: (req, res) => {
		return res.render("./main/graciass", {
			color: req.session.colorLogged
		})
	},
	chau: (req, res) => {
		res.clearCookie("color")/* borra la cookie para mantener sesion */
        req.session.destroy(); /* borra automaticamente todo registro en session */
		return res.redirect("/");
	},
};

module.exports = controller;
