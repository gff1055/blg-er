
/**
 * Estruturacao do sistema de autenticacao
 */

const localStrategy     = require("passport-local").Strategy
const bcrypt            = require("bcryptjs")

// Model de usuario
/*require("../models/usuario")
const Usuario = mongoose.model("usuarios")*/
const Usuario     = require('../models/Usuario')


module.exports = function(passport){    // Configuracao do sistema de autenticacao


    passport.use(new localStrategy({usernameField: 'email', passwordField: 'senha'}, (email, senha, done) => {

        /*Usuario.findOne({email}).then((usuario) => {

            if(!usuario){
                return done(null, false, {message: "Esta conta nao existe"})
            }

            
            bcrypt.compare(senha, usuario.senha, (erro, batem) => {
                
                if(batem){
                    return done(null, user)
                }else{
                    return done(null, false, {message: "Senha incorreta"})
                }
            })
        })*/

        Usuario.findOne({
            where:{email: email}
        }).then((usuario) => {
            if(!usuario){
                return done(null, false, {message: "Esta conta nao existe"})
            }

            bcrypt.compare(senha, usuario.senha, (erro, batem) => {
                
                if(batem)   return done(null, usuario)
                else        return done(null, false, {message: "Senha incorreta"})

            })
        })
    }))


    passport.serializeUser((usuario, done) => {
        console.log("DONE1             >> " + done);
        done(null, usuario.id)
    })


    passport.deserializeUser((id,done) => {

        /*Usuario.findById(id, (err,usuario) => {
            done(err, user)
        })*/

        done(null, id)
    })
}