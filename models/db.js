// conexao com o banco de dados
const sequelize = require('sequelize');

//sequelize
const coneBanco = new sequelize('blogapp','root','souzagroot',{
    host: "localhost",
    dialect: 'mysql'    
})

/*coneBanco.authenticate()
.then(() => console.log("Banco conectado"))
.catch(() => console.log("Houve algum erro"))*/

module.exports = {
    sequelize: sequelize,
    coneBanco: coneBanco,
}



