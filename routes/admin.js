/** Guarda todas as rotas de /admin */

const express   = require("express");
const router    = express.Router();     // componente a ser usado para criar rotas em arquivos separados
const Categoria = require('../models/Categoria')
const Postagem  = require('../models/Postagem')

// Dentro do objeto retornado, é pego apenas a funcao eAdmin
const {eAdmin}  = require("../helpers/eAdmin")


isNoneInfo = (pField) =>{
    if(!pField
    || typeof pField == undefined
    || pField == null){
        return true;
    }

    return false;
    
}


router.get('/', eAdmin, (req, res) => {         // rota principal para o painel administrativo
    res.render("admin/index");          // 
})

router.get('/posts', eAdmin, (req, res) => {    // 
    res.send("pagina de posts");
})

router.get('/categorias', eAdmin, (req, res) => {
    // Lista as categorias
    Categoria.findAll({order: [['date', 'DESC']]})
    .then(function(categorias){                          // sucesso na listagem
        res.render("admin/categorias", {categorias: categorias});
    })
    .catch(function(error){                                           // falha na listagem
        req.flash("error_msg", "Houve um erro ao listar as categorias");
        res.redirect("/admin");
    })
    
})

router.get('/categorias/add', eAdmin, (req,res) => {
    res.render("admin/addcategorias")
})



router.post('/categorias/nova', eAdmin, (req, res) => {

    /* Validando o formulario de categorias */

    var erros = [];

    /** Testa se o usuario enviou formulario vazio */
    if(isNoneInfo(req.body.nome))   erros.push({texto: "Nome invalido"})
    if(isNoneInfo(req.body.slug))   erros.push({texto: "Slug invalido"})
    

    /** Testa se o nome da categoria é muito curto */
    if(req.body.nome.length < 2){
        erros.push({texto: "Nome da categoria é muito curto"})
    }

    /* Se houver erros ele os exibe na pagina, senão efetua o cadastro da categoria */
    if(erros.length > 0){
        res.render("admin/addcategorias", {erros: erros})
    }
    else{

        /** Criando a categoria */
        Categoria.create({
            nome:   req.body.nome,
            slug:   req.body.slug
        }).then(function(){                                                 // Caso a categoria seja criada
            req.flash("success_msg", "Categoria criada com sucesso!")       // Exibe feedback
            res.redirect("/admin/categorias")                               // Redirecionamento

        }).catch(function(err){                                             // Caso haja erro na criacao da categoria
            req.flash("error_msg", "Houve um erro ao salvar a categoria!")  // Exibe erro
        })

    }
})


router.get("/categorias/edit/:id", eAdmin, (req, res) => {
    Categoria.findOne({
        where:{id: Number.parseInt(req.params.id)}
    }).then((categoria) => {

        res.render("admin/editcategorias", {
            categoria: categoria
        });

    }).catch((err) =>{

        req.flash("error_msg", "Categoria nao encontrada")
        res.redirect("/admin/categorias")

    })
    
})

router.post("/categorias/edit", eAdmin, (req, res) => {
  

        Categoria.findOne({
            where:{id: Number.parseInt(req.body.id)}
        }).then((categoria) => {

                /* Validando o formulario de categorias */
                var erros = [];
                
                /** Testa se o usuario enviou formulario vazio */
                if(isNoneInfo(req.body.nome))   erros.push({texto: "Nome invalido"})
                if(isNoneInfo(req.body.slug))   erros.push({texto: "Slug invalido"})

                /** Testa se o nome da categoria é muito curto */
                if(req.body.nome.length < 2){
                    erros.push({texto: "Nome da categoria é muito curto"})
                }
                /* Se houver erros ele os exibe na pagina, senão efetua o cadastro da categoria */
                if(erros.length > 0){
                    res.render("admin/editcategorias", {erros: erros, categoria:categoria})
                }



        else{
            categoria.nome = req.body.nome;
            categoria.slug = req.body.slug;

            categoria.save().then(() => {
                req.flash("success_msg", "Categoria foi alterada")
                res.redirect("/admin/categorias")
            }).catch((err) => {
                req.flash("error_msg", "Houve um erro interno ao salvar a edicao da categoria");
                res.redirect("/admin/categorias");
            })
        }
        }).catch((err) =>{
            req.flash("error_msg", "Erro ao editar categoria")
            res.redirect("/admin/categorias")
        })
})


router.post("/categorias/deletar", eAdmin, (req,res) => {
    Categoria.destroy({
        where: {id: req.body.id}
    }).then(() => {
        req.flash("success_msg","Categoria deletada");
        res.redirect("/admin/categorias");
    }).catch((err) => {
        req.flash("error_msg","houve um erro ao deletar a categoria")
        res.redirect("/admin/categorias")
    })
})


router.get("/postagens", eAdmin, (req, res) =>{
    /*Postagem.find().populate("categorias").sort({data: "desc"}).then((postagens) => {
        res.render("admin/postagens", {postagens: postagens})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as postagens")
        res.redirect("/admin")
    })*/

    Postagem.findAll({
        raw: true,
        /*attributes: attributes,*/
        include:[{
            model:  Categoria,
            required: true,
            attributes: ['nome']
        }]
        /*order: [['']]*/
    }).then((postagens) => {
        res.render("admin/postagens", {postagens: postagens})
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as postagens")
        res.redirect("/admin")
    })
})


router.get("/postagens/add", eAdmin, (req, res) => {

    // Lista as categorias
    Categoria.findAll()
    .then(function(categorias){                          // sucesso na listagem
        res.render("admin/addpostagem", {categorias: categorias});
    })
    .catch(function(error){                                           // falha na listagem
        req.flash("error_msg", "Houve um erro ao carregar o formulario");
        res.redirect("/admin");
    })
})

router.post("/postagens/nova", eAdmin, (req, res) => {

    var erros = [];

    /*** 
     * Validacoes aqui 
     * */

    /** Testa se o usuario enviou formulario vazio */
    if(isNoneInfo(req.body.titulo))       erros.push({texto: "Nome invalido"})
    if(isNoneInfo(req.body.descricao))  erros.push({texto: "descricao invalido"})
    if(isNoneInfo(req.body.conteudo))   erros.push({texto: "conteudo invalido"})
    if(isNoneInfo(req.body.slug))       erros.push({texto: "slug invalido"})


    if(req.body.categoria == "0"){
        erros.push({texto: "Categoria invalida, registre outra"})
    }

    if(erros.length > 0){
        
         // Lista as categorias
        Categoria.findAll()
        .then(function(categorias){                          // sucesso na listagem
            res.render("admin/addpostagem", {erros: erros, categorias: categorias});
        })
        .catch(function(error){                                           // falha na listagem
            req.flash("error_msg", "Houve um erro na pagina de adição de postagens");
            res.redirect("/admin");
        })

        //res.render("admin/addpostagem", )
    }
    else{
        console.log(req.body);
        Postagem.create({
            titulo          : req.body.titulo,
            descricao       : req.body.descricao,
            conteudo        : req.body.conteudo,
            categoriaId     : req.body.categoria,
            slug            : req.body.slug 
        }).then(function(teste){
            req.flash("success_msg", "Postagem criada")
            res.redirect("/admin/postagens")
        }).catch((err) => {
            req.flash("error_msg", "Houve um erro durante o salvamento da postagem")
            res.redirect("/admin/postagens")
        })
    }
})



router.get("/postagens/edit/:id", eAdmin, (req, res) => {

    Postagem.findOne({
        where:{
            id: Number.parseInt(req.params.id)
        }
    }).then((postagem) => {

        // Lista as categorias
        Categoria.findAll().then((categorias) => { // sucesso na listagem
            res.render("admin/editpostagens", {
                categorias: categorias,
                postagem: postagem
            })

        }).catch(function(error){                                           // falha na listagem
            req.flash("error_msg", "Houve um erro ao listar as categorias");
            res.redirect("/admin/postagens");
        })


    }).catch((err) =>{

        req.flash("error_msg", "Houve um erro ao carregar o formulario de edição")
        res.redirect("/admin/categorias")

    })
})



router.post("/postagens/edit", eAdmin, (req, res) => {

    Postagem.findOne({
        where:{id: Number.parseInt(req.body.id)}
    }).then((postagem) => {


        /* Validando o formulario de categorias */
        var erros = [];
            
        /** Testa se o usuario enviou formulario vazio */
        if(isNoneInfo(req.body.titulo))     erros.push({texto: "Titulo invalido"})
        if(isNoneInfo(req.body.slug))       erros.push({texto: "Slug invalido"})
        if(isNoneInfo(req.body.descricao))  erros.push({texto: "descricao invalido"})
        if(isNoneInfo(req.body.conteudo))   erros.push({texto: "conteudo invalido"})
        

        /** Se houver erros as categorias sao carregvadas e uma nova pagona é renderizada */
        if(erros.length > 0){
                    /*INICIO*/
                        // Lista as categorias
            Categoria.findAll()
            .then(function(categorias){                          // sucesso na listagem
                res.render("admin/editpostagens", {erros: erros, postagem:postagem, categorias:categorias})
            })
            .catch(function(error){                                           // falha na listagem
                req.flash("error_msg", "Erro interno do formulario");
                res.redirect("/admin/postagens");
            })

        }

        else{
            postagem.titulo     = req.body.titulo
            postagem.slug       = req.body.slug
            postagem.descricao  = req.body.descricao
            postagem.conteudo   = req.body.conteudo
            postagem.categoriaId  = req.body.categoria

            postagem.save().then(() => {
                req.flash("success_msg", "Categoria foi alterada")
                res.redirect("/admin/postagens")
            }).catch((err) => {
                req.flash("error_msg", "Houve um erro interno ao salvar a edicao da categoria");
                res.redirect("/admin/postagens");
            })
        }

    }).catch((err) =>{
        req.flash("error_msg", "Erro ao editar categoria" + err)
        res.redirect("/admin/postagens")
    })

})

router.get("/postagens/deletar/:id", eAdmin, (req, res) => {
    
    Postagem.destroy({
        where: {id: req.params.id}
    }).then(() => {
        req.flash("success_msg","Postagem deletada");
        res.redirect("/admin/postagens");
    }).catch((err) => {
        req.flash("error_msg","houve um erro interno ao deletar a postagem")
        res.redirect("/admin/postagens")
    })
})


module.exports = router;    // exportando o componentes