const bancoDados = require('./db')


const Usuario = bancoDados.coneBanco.define('usuarios', {

    nome:{
        type:       bancoDados.sequelize.STRING,
        allowNull:  false
    },

    email:{
        type:       bancoDados.sequelize.STRING,
        allowNull:  false
    },

    eAdmin:{
        type: bancoDados.sequelize.INTEGER,
        defaultValue: 0

    },

    senha:{
        type:       bancoDados.sequelize.STRING,
        allowNull:  false
    }
})

//Usuario.sync({force: true})

module.exports = Usuario;