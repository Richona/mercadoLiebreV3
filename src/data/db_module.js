const fs = require('fs');
const path = require('path');

const loadProducts = ()=>{
    return JSON.parse(fs.readFileSync(path.join(__dirname, "./productsDataBase.json"), "utf-8"))/* Leemos el archivo JSON y lo convertimos a objeto */
};

const storeProducts = (products) => {
    fs.writeFileSync(path.join(__dirname, "./productsDataBase.json"), JSON.stringify(products, null, 3), "utf-8")/* Convertimos el objeto a JSON y lo escribimos en products.json */
};

const loadUsers = ()=>{
    return JSON.parse(fs.readFileSync(path.join(__dirname, "./usersDataBase.json"), "utf-8"))/* Leemos el archivo JSON y lo convertimos a objeto */
};

const storeUsers = (users) => {
    fs.writeFileSync(path.join(__dirname, "./usersDataBase.json"), JSON.stringify(users, null, 3), "utf-8")/* Convertimos el objeto a JSON y lo escribimos en products.json */
};

const actId = (products) => {
    for (let x = 0; x < products.length; x++) {/* En la primer pasada el id empieza con 1, los demas id van sumando */
        x === 0 ? products[x].id = 1 : products[x].id = x + 1;  
    }
}

module.exports = {
    loadProducts,
    storeProducts,
    loadUsers,
    storeUsers,
    actId
};