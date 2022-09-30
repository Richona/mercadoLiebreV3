const {loadProducts, storeProducts, actId} = require("../data/db_module");/* requerimos las funciones asociadas al json */
const fs = require("fs")
const path = require("path");

const db = require('../database/models');

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");/* Recibe un numero y separa con punto los miles */

const controller = {
	index: (req, res) => {/* METODO GET DE PRODUCTOS EN GENERAL /products */
		db.Product.findAll({
			include : ['images']
		})
			.then(products => res.render('products', {
				products,
				toThousand
			}))
		//const products = loadProducts();/* cargamos los productos */
		//return res.render("./products/products",{/* Renderizamos, mandamos productos y la funcion que separa en miles */
			//products,
			//toThousand
		//})
	},
	detail: (req, res) => {/* METODO GET DE DETALLE DE PRODUCTO /products/detail/:id */
		const products = loadProducts();/* cargamos los productos */
		const product = products.find(product => product.id === +req.params.id)/* Buscamos un id de producto igual al id del parametro */
		return res.render("./products/detail",{/* Renderizamos, mandamos el producto encontrado con la funcion de separar en miles */
			product,
			toThousand
		})
	},
	create: (req, res) => {/* METODO GET DE CREAR PRODUCTO /products/create */
		const products = loadProducts();/* cargamos los productos */
		return res.render("./products/product-create-form",{/* Renderizamos y mandamos productos */
			products,
		})
	},
	store: (req, res) => {/* METODO POST DE CREAR PRODUCTO /products/create */
		const products = loadProducts();/* cargamos los productos */
		const {name, price, discount, category, description} = req.body;/* Destructuring de los datos recibidos del usuario */
		const id = products[products.length - 1].id;/* Sacamos el ultimo id */

		const newProduct ={/* Creamos un nuevo producto */
			id: id+1,
			name: name.trim(),/* Trim sirve para sacar espacios al inicio y final */
			description: description.trim(),
			price: +price,/* + parse el string a number */
			discount: +discount,
			image: req.file ? req.file.filename : "default-image.png",
			category
		}
		const productsNew = [...products, newProduct];/* Agregamos el nuevo producto a los demas con spread */
		storeProducts(productsNew);/* Mandamos a escribir los productos al JSON */
		return res.redirect("/");/* Redirigimos al home */
	},
	edit: (req, res) => {/* METODO GET DE EDITAR PRODUCTO /products/edit/:id */
		const products = loadProducts();/* cargamos los productos */
		const productToEdit = products.find(product => product.id === +req.params.id)/* Buscamos un id de producto igual al id del parametro */
		return res.render("./products/product-edit-form",{/* Rendizamos y mandamos el producto encontrado para editar */
			productToEdit,
		})
	},
	update: (req, res) => {/* METODO PUT DE EDITAR PRODUCTO /products/update/:id */
		const products = loadProducts();/* cargamos los productos */
		const {id} = req.params;/* Sacamos el id del parametro */
		const {name, price, discount, category, description} = req.body;/* Destructuring de los datos recibidos del usuario */
		const productsModify = products.map(product =>{/* Recorremos los productos */
			if (product.id === +id) {/* Si el id del producto es igual al id del parametro entra */
				return {
					...product,
					name: name.trim(),/* trim sirve para sacar espacios al inicio y final */
					description: description.trim(),
					price: +price,/* + parsea un string a number */
					discount: +discount,
					image: req.file ? req.file.filename : product.image,
					category,
				};
			};
			return product;
		});
		storeProducts(productsModify);/* Escribimos los productos en el JSON */
		return res.redirect("/products/edit/" + req.params.id);/* Redirigimos a la edicion de un producto */
	},
	destroy : (req, res) => {/* METODO DELETE DE ELIMINAR PRODUCTO /products/delete/:id */
		const products = loadProducts();/* cargamos los productos */
		products.forEach(product => {
			if (product.id === +req.params.id) {
				fs.existsSync(path.resolve(__dirname, "..", "..", "public", "images", "products", product.image)) && fs.unlinkSync(path.resolve(__dirname, "..", "..", "public", "images", "products", product.image))/* existsSync busca si existe el archivo y unlinkSync lo elimina */
			}
		});

		const productsModify = products.filter(product => product.id !== +req.params.id)/* Sacamos el producto que tenga el id igual al id de parametro, los demas siguen. */
		actId(productsModify);/* Actualizamos el id sin el producto eliminado */
		storeProducts(productsModify);/* Escribimos los productos en el JSON */

		return res.redirect("/products");/* Redirigimos a los productos */
	}
};

module.exports = controller;