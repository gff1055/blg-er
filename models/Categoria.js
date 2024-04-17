
const bancoDados = require('./db')


const Categoria = bancoDados.coneBanco.define('categorias', {

    nome:{
        type:       bancoDados.sequelize.STRING,
        allowNull:  false
    },

    slug:{
        type:       bancoDados.sequelize.STRING, 
        allowNull:  false
    },

    date:{
        type: bancoDados.sequelize.DATE,
        defaultValue: bancoDados.coneBanco.fn('NOW')

    }
})

//Categoria.sync({force: true})

module.exports = Categoria;
