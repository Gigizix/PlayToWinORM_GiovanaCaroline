// Importações de módulos 
require("dotenv").config();
const conn = require("./db/conn");
const Usuario = require("./models/Usuario");
const Jogo = require("./models/Jogo")
const express = require("express");
const handle = require("express-handlebars");
const { where } = require("sequelize");
const Cartao = require("./models/Cartao");
const Conquista = require("./models/Conquista");
const app = express();

app.engine("handlebars", handle.engine());
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.render("home");
})

app.get("/usuarios", async (req, res) => {
    const usuarios = await Usuario.findAll({ raw: true })
    res.render("usuarios", { usuarios });
})

app.get("/usuarios/novo", (req, res) => {
    res.render("formUsuario");
});

app.post("/usuarios/novo", async (req, res) => {
    try {
        const { nickname, nome } = req.body;

        const dadosUsuario = {
            nickname,
            nome,
        };
        const usuario = await Usuario.create(dadosUsuario);

        res.send("Usuário inserido sob o id " + usuario.id);
    } catch (error) {
        console.error("Erro ao inserir usuário:", error);
        res.status(500).send("Erro ao inserir usuário");
    }
});

app.get("/jogos", async (req, res) => {
    const jogos = await Jogo.findAll({ raw: true });
    res.render("jogos", { jogos });
});


app.get("/jogos/novo", (req, res) => {
    res.render(`formJogo`);
});

app.post("/jogos/novo", async (req, res) => {
    try {
        const { titulo, descricao, precoBase } = req.body;

        const dadosJogo = {
            titulo,
            descricao,
            precoBase,
        };
        const jogo = await Jogo.create(dadosJogo);
        console.log(jogo)

        res.send("Jogo inserido sob o id " + jogo.id);
    } catch (error) {
        console.error("Erro ao inserir jogo:", error);
        res.status(500).send("Erro ao inserir jogo");
    }
});

app.get("/jogos/:id/update", async (req, res) => {
    const id = parseInt(req.params.id);
    const jogo = await Jogo.findByPk(id, { raw: true });
    res.render("formJogo", { jogo });
});

app.post("/jogos/:id/update", async (req, res) => {
    const id = parseInt(req.params.id);
    const dadosJogo = {
        nome: req.body.nome,
        descricao: req.body.descricao,
        preco: req.body.preco
    };
    const retorno = await Jogo.update(dadosJogo, { where: { id: id } })

    if (retorno > 0) {
        res.redirect("jogos")
    } else {
        res.send("Erro ao atualizar o jogo")
    }
});

//Deletar 
app.post("/jogos/:id/delete", async (req, res) => {
    const id = parseInt(req.params.id);

    const retorno = await Jogo.destroy({ where: { id: id } });

    if (retorno > 0) {
        res.redirect("/jogos")
    } else {
        res.send("Erro ao deletar o jogo")
    }
});


app.get("/usuarios/:id/update", async (req, res) => {
    const id = parseInt(req.params.id);
    const usuario = await Usuario.findByPk(id, { raw: true });

    res.render("formUsuario", { usuario })
});

app.post("/usuarios/:id/update", async (req, res) => {
    const id = parseInt(req.params.id);
    const dadosUsuario = {
        nickname: req.body.nickname,
        nome: req.body.nome,
    }
    const retorno = await Usuario.update({ dadosUsuario, where: { id: id } });

    if (retorno > 0) {
        res.redirect("/usuarios/novo");
    }
    else {
        res.send("Erro ao atualizar usuario!")
    }
});

app.post("/usuarios/:id/delete", async (req, res) => {
    const id = parseInt(req.params.id);

    const retorno = await Usuario.destroy({ where: { id: id } });

    if (retorno > 0) {
        res.redirect("/usuarios");
    } else {
        res.send("Erro ao excluir usuário");
    }
});

app.get("/usuarios/:id/novoCartao", async (req, res) => {
    const id = parseInt(req.params.id);
    const usuario = await Usuario.findByPk(id, { raw: true });

    res.render("formCartao", { usuario });
});

//Cadastro de cartão
app.post("/usuarios/:id/novoCartao", async (req, res) => {
    const id = parseInt(req.params.id);

    const dadosCartao = {
        numero: req.body.numero,
        nome: req.body.nome,
        codSeguranca: req.body.codSeguranca,
        UsuarioId: id,
    };

    await Cartao.create(dadosCartao);
    res.redirect(`/usuarios/${id}/cartoes`);
})

app.get("/usuarios/:id/cartoes", async (req, res) => {
    const id = parseInt(req.params.id);
    const usuario = await Usuario.findByPk(id, { raw: true });

    const cartoes = await Cartao.findAll({
        raw: true,
        where: { UsuarioId: id },
    });

    res.render("cartoes.handlebars", { usuario, cartoes });
});


/* */

app.get("/jogos/:id/novaConquista", async (req, res) => {
    const id = parseInt(req.params.id);
    const jogo = await Jogo.findByPk(id, { raw: true });

    res.render("formConquista", { jogo });
});

//Cadastro de cartão
app.post("/jogos/:id/novaConquista", async (req, res) => {
    const id = parseInt(req.params.id);

    const dadosConquista = {
        numero: req.body.numero,
        nome: req.body.nome,
        codSeguranca: req.body.codSeguranca,
        UsuarioId: id,
    };

    await Conquista.create(dadosConquista);
    res.redirect(`/jogos/${id}/conquista`);
})

app.get("/jogos/:id/conquistas", async (req, res) => {
    const id = parseInt(req.params.id);
    const jogo = await Jogo.findByPk(id, { raw: true });

    const conquista = await Conquista.findAll({
        raw: true,
        where: { JogoId: id },
    });

    res.render("conquista.handlebars", { jogo, conquista });
});






app.listen(8000, () => {
    console.log("Servidor está ouvindo na porta 8000");
});

conn
    .sync()
    .then(() => {
        console.log("Conectado e sincronizado ao banco de dados com sucesso!");
    })
    .catch(err => {
        console.error("Ocorreu um erro ao conectar/sincronizar o banco de dados:", err);
    });