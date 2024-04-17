const bancoDados    = require('./db')
const Categoria     = require('./Categoria')

const Postagem = bancoDados.coneBanco.define('postagens', {

    titulo:{
        type:       bancoDados.sequelize.STRING,
        allowNull:  false
    },

    slug:{
        type:       bancoDados.sequelize.STRING,
        allowNull:  false
    },

    descricao:{
        type:       bancoDados.sequelize.STRING,
        allowNull:  false
    },

    conteudo:{
        type:       bancoDados.sequelize.TEXT,
        allowNull:  false
    },

    date:{
        type:           bancoDados.sequelize.DATE,
        defaultValue:   bancoDados.coneBanco.fn('NOW')
    }

});

/** Relacionamento das tabelas */
Categoria.hasMany(Postagem);
Postagem.belongsTo(Categoria,{
    foreignKey: 'categoriaId'
});

//Postagem.sync({force: true})
module.exports = Postagem;
