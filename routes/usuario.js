const express   = require('express')
const router    = express.Router()
const Usuario   = require('../models/Usuario')
const bcrypt    = require("bcryptjs")
const passport  = require("passport")

router.get("/registro", (req, res) => {
    res.render("usuarios/registro")
})


router.post("/registro", (req,res) => {

    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto: "Nome invalido"})
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto: "Email invalido"})
    }

    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto: "Senha invalida"})
    }

    if(req.body.senha.length < 4){
        erros.push({texto: "Senha muito curta"})
    }

    if(req.body.senha != req.body.senha2){
        erros.push({texto: "As senhas são diferentes, tente novamente"})
    }

    if(erros.length > 0){
        res.render("usuarios/registro", {erros: erros})
    }else{

        
        Usuario.findOne({
            where:{email: req.body.email}
        }).then((usuario) => {

            if(usuario){

                req.flash("error_msg", "Ja existe uma conta com este email")
                res.redirect("/usuarios/registro")

            }else{
                
                const novoUsuario = new Object();

                novoUsuario.nome    = req.body.nome;
                novoUsuario.email   = req.body.email;
                novoUsuario.senha   = req.body.senha;

                //Encriptando a senha
                bcrypt.genSalt(10, (erro, salt) => {
                    bcrypt.hash(novoUsuario.senha, salt, (erro, hash) => {
                        if(erro){
                            req.flash("error_msg", "Houve um erro durante o saovamento do usuaario")
                            res.redirect("/")
                        }

                        novoUsuario.senha = hash

                        Usuario.create({
                            nome:novoUsuario.nome,
                            email:novoUsuario.email,
                            senha:novoUsuario.senha
                        }).then(() => {
                            req.flash("success_msg", "Usuario criado com sucesso")
                            res.redirect("/")
                        }).catch((err) => {
                            req.flash("error_msg", "Houve um erro ao criar o usuario, tente novamente!")
                            res.redirect("/usuario/registro");
                        })
                    })
                })

            }
    
        }).catch((err) =>{
    
            req.flash("error_msg","Houve um erro interno")
            res.redirect("/")
    
        })
    }
})


router.get("/login", (req,res) => {
    res.render("usuarios/login")
})


/**rota de autenticacao */
router.post("/login", (req, res, next) => {

    /** autenticando as credenciais de login */
    passport.authenticate("local", {
        successRedirect: "/",                   
        failureRedirect: "/usuarios/login",     /**caminho se autenticacao  falhar*/
        failureFlash: true                      // Habilitar as mensagens flash
    })(req, res, next)

})



// rota de logout
router.get("/logout", (req, res) => {
    /*req.logout();
    req.flash('success_msg',"Deslogado com sucesso")
    res.redirect("/")*/
    req.logout(function(err) {
        if (err) { return next(err) }
        req.flash('success_msg',"Deslogado com sucesso")
        res.redirect("/")
    })
})

module.exports = router;