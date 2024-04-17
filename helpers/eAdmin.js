/**
 * Verifica se um usuario esta autenticado e é admin 
 */

const Usuario   = require('../models/Usuario')




module.exports = {

    eAdmin: function(req, res, next){   // middleware


        Usuario.findOne({
            where:{id: Number.parseInt(req.user)}
        }).then((usuario) => {

            // se o usuario esta autenticado e é admin a requisicao passa
            if(req.isAuthenticated() && usuario.eAdmin == 1){
                return next();
            }

            console.log("REQ USER ADMIN     >>"+req.user);

            req.flash("error_msg", "Voce precisa ser um Admin!")
            res.redirect("/")
    
        }).catch((err) =>{
    
            /*req.flash("error_msg", "Categoria nao encontrada")
            res.redirect("/admin/categorias")*/
            console.log(">>>>> ACONTECEU UM ERRO <<<<<<<<" + err)
            /*req.flash("error_msg", "Voce precisa ser um Admin!")
        res.redirect("/")*/
    
        })

        // se o usuario esta autenticado e é admin a requisicao passa
        /*if(req.isAuthenticated() && req.user.eAdmin == 1){
            return next();
        }*/

        
    }


}