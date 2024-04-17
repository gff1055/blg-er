
// modulos
const express       = require('express');
const handlebars    = require('express-handlebars');
const bodyParser    = require('body-parser');
const app           = express();                    // recebe a funcao que vem do express
const admin         = require("./routes/admin");    // recebe o grupo de rotas definidas
const path          = require("path");              // modulo para manipulacao de diretorios e pastas
const session       = require("express-session");   
const flash         = require("connect-flash");     // Gerenciamento de sessoes que aparecem apenas uma vez

const Postagem      = require('./models/Postagem');      // Carrega o modulo de postagens
const Categoria     = require('./models/Categoria')

const usuarios      = require("./routes/usuario")

const passport      = require("passport")
require("./config/auth")(passport)



// *************** configuracoes *********************

// Configurando a Sessão
app.use(session({
    secret              : "cursodenode",    // chave para gerar uma sessão
    resave              : true,
    saveUninitialized   : true
}))


app.use(passport.initialize())
app.use(passport.session())
app.use(flash())                            // configurando o flash (sessoes que aparecem apenas uma vez)


// Configurando o middleware
app.use((req, res, next) => {
    // Declarando variaveis globais para serem acessadas em qualquer parte da aplicacao
    res.locals.success_msg  = req.flash("success_msg");
    res.locals.error_msg    = req.flash("error_msg");
    res.locals.error        = req.flash("error")
    res.locals.user         = req.user || null;     // armazena os dados do usuario logado (ou null se nao houver logado)
    next();
})



// body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());



//handlebars -  Template Engine
app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main',
    /** Adicao para corrigir o erro de renderizacao */
    runtimeOptions:{
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
    /** */
}));
app.set('view engine', 'handlebars');



// Configuracao public

// Definindo no express a pasta public como a pasta que quarda os arquivos estaticos
// path.join(__dirname,"public") => caminho absoluto para a pasta public
app.use(express.static(path.join(__dirname,"public")))





//***************** rotas ******************

app.get('/', (req, res) => {
    
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
        res.render("index", {postagens: postagens});
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno")
        res.redirect("/404")
    })
})


app.get("/postagem/:slug", (req, res) => {
    Postagem.findOne({
        where:{slug: req.params.slug}
    }).then((postagem) => {
        if(postagem){
            res.render("postagem/index", {postagem:postagem})
        }else{
            req.flash("error_msg", "Esta postagem nao existe")
            res.redirect("/")
        }
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno")
        res.redirect("/")
    })
})


app.get("/404", (req, res) =>{
    res.send("ERRO 404!")
})



// url de listagem de categorias
app.get("/categorias", (req, res) => {

    // listando as categrias
    
    Categoria.findAll().then(function(categorias){                          // sucesso na listagem
        res.render("categorias/index", {categorias: categorias});
    })
    .catch(function(error){                                           // falha na listagem
        req.flash("error_msg", "Houve um erro interno ao listar as categorias");
        res.redirect("/");
    })
})



app.get("/categorias/:slug", (req,res) => {
    Categoria.findOne({
        where:{slug: req.params.slug}
    }).then((categoria) => {
        if(categoria){

            console.log(categoria);
            
            Postagem.findAll({
                where:{categoriaId: categoria.id}
            }).then(function(postagens){                          // sucesso na listagem
                res.render("categorias/postagens", {postagens:postagens, categoria:categoria});
            })
            .catch(function(error){                                           // falha na listagem
                req.flash("error_msg", "Houve um erro ao listar os posts!" + error);
                res.redirect("/");
            })
            
        }else{
            req.flash("error_msg", "Esta categoria nao existe")
            res.redirect("/")
        }
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno ao carregar a pagina desta categoria")
        res.redirect("/")
    })

    /*Categoria.findOne({slug: req.params.slug})
    .then((categoria) => {
        if(categoria){
            Postagem.find({categoria: categoria.id}).then((postagens) => {
                res.render("categorias/postagens", {postagens:postagens, categoria:categoria});
            }).catch((err) => {
                req.flash("error_msg", "Houve um erro ao listar os posts!")
                res.redirect("/")
            })
        }else{
            req.flash("error_msg", "Esta categoria nao existe")
            res.redirect("/")
        }
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro interno ao carregar a pagina desta categoria")
        res.redirect("/")
    
    })*/
})


app.use('/admin', admin);   // definindo o grupo de rotas
app.use('/usuarios', usuarios)

// outros

const PORT = 8888;
app.listen(PORT, ()=>{
    console.log("Servidor rodando!");
})