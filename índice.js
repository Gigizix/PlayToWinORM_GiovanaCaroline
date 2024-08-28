
require("dotenv").config();
const express = require("express");
const conn = require("./db/conn");
const handlebars = require("express-handlebars");
const Usuario = require("./models/Usuario");
const Jogo = require("./models/Jogo");
const Cartao = require("./models/Cartao");
const Conquista = require("./models/Conquista")
const { DataTypes } = require("sequelize");

const app = express();

// Handlebars
app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")

// Configurações do middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Rotas do Home

app.get("/", (req, res) => {
  res.render("home");
});

// Rotas do Usuarios

app.post("/usuario/novo", async (req, res) => {
  const dadosUsuario = {
    nickname: req.body.nickname,
    nome: req.body.nome
  };

  const usuario = await Usuario.create(dadosUsuario);
  res.send("Usuário cadastrado com id " + usuario.id + `<a href= "http://localhost:8000/usuarios"> Voltar </a>`);
});

app.get("/usuarios/novo", (req, res) => {
  res.render("formUsuario");
});

app.get("/usuarios", async (req, res) => {
  const usuarios = await Usuario.findAll({ raw: true });
  res.render("usuarios", { usuarios });
});

app.get("/usuarios/:id/atualizar", async (req, res) => {
  const id = req.params.id;
  const usuario = await Usuario.findByPk(id, { raw: true });
  res.render("formUsuario", { usuario });
});

app.post("/usuarios/:id/atualizar", async (req, res) => {
  const id = req.params.id;

  const dadosUsuario = {
    nickname: req.body.nickname,
    nome: req.body.nome
  };
  const registroAfetados = await Usuario.update(dadosUsuario, { where: { id: id } });
  if (registroAfetados > 0) {
    res.redirect("/usuarios");
  } else {
    res.send("Erro ao atualizar usuário");
  }
});

app.post("/usuarios/excluir", async (req, res) => {
  const id = req.body.id
  const registroAfetados = await Usuario.destroy({ where: { id: id } });

  if (registroAfetados > 0) {
    res.redirect("/usuarios");
  } else {
    res.send("Erro ao excluir usuário");
  }
});

// Rotas do Jogo

app.post("/jogo/novo", async (req, res) => {
  const dadosJogo = {
    titulo: req.body.titulo,
    descricao: req.body.descricao,
    precoBase: req.body.precoBase
  };

  const jogo = await Jogo.create(dadosJogo);
  res.send("Jogo cadastrado com id " + jogo.id + `<a href= "http://localhost:8000/jogos"> Voltar </a>`);
});

app.get("/jogos/novo", (req, res) => {
  res.render("formJogo");
});

app.get("/jogos", async (req, res) => {
  const jogos = await Jogo.findAll({ raw: true });
  res.render("jogos", { jogos });
});

app.get("/jogos/:id/atualizar", async (req, res) => {
  const id = req.params.id;
  const jogo = await Jogo.findByPk(id, { raw: true });
  res.render("formJogo", { jogo });
});

app.post("/jogos/:id/atualizar", async (req, res) => {
  const id = req.params.id;

  const dadosJogo = {
    titulo: req.body.titulo,
    descricao: req.body.descricao,
    precoBase: req.body.precoBase
  };
  const registroAfetados = await Jogo.update(dadosJogo, { where: { id: id } });
  if (registroAfetados > 0) {
    res.redirect("/jogos");
  } else {
    res.send("Erro ao atualizar jogo");
  }
});

app.post("/jogos/excluir", async (req, res) => {
  const id = req.body.id
  const registroAfetados = await Jogo.destroy({ where: { id: id } });

  if (registroAfetados > 0) {
    res.redirect("/jogos");
  } else {
    res.send("Erro ao excluir jogo");
  }
});

// Rotas dos Cartoes

app.get('/usuarios/:id/cartoes', async (req, res) => {
  const id = parseInt(req.params.id)
  const usuario = await Usuario.findByPk(id, { include: ["Cartaos"] });

  let cartoes = usuario.Cartaos;
  cartoes = cartoes.map((cartao) => cartao.toJSON())


  res.render("Cartoes.handlebars", { usuario: usuario.toJSON(), cartoes });
});

//Formulário de cadastro de cartão
app.get("/usuarios/:id/novoCartao", async (req, res) => {
  const id = parseInt(req.params.id);
  const usuario = await Usuario.findByPk(id, { raw: true });

  res.render("formCartao", { usuario });
});


app.post("/usuarios/:id/novoCartao", async (req, res) => {
  const id = parseInt(req.params.id);
  
  const dadosCartao = {
    numero: req.body.numero,
    nome: req.body.nome,
    cvv: req.body.codSeguranca,
    UsuarioId: id,
  };

  await Cartao.create(dadosCartao);

  res.redirect(`/usuarios/${id}/cartoes`);
});

// Rotas Conquistas

app.get('/jogos/:id/conquistas', async (req, res) => {
  const id = parseInt(req.params.id)
  const jogo = await Jogo.findByPk(id, { include: ["Conquista"] });

  let conquistas = jogo.Conquista;
  conquistas = conquistas.map((conquista) => conquista.toJSON())


  res.render("Conquista.handlebars", { jogo: jogo.toJSON(), conquistas });
});

//Formulário de cadastro de conquista
app.get("/jogos/:id/novaConquista", async (req, res) => {
  const id = parseInt(req.params.id);
  const jogo = await Jogo.findByPk(id, { raw: true });

  res.render("formConquista", { jogo });
});

app.post("/jogos/:id/novaConquista", async (req, res) => {
  const id = parseInt(req.params.id);

  const dadosConquista = {
    titulo: req.body.titulo,
    descricao: req.body.descricao,
    JogoId: id,
  };

  await Conquista.create(dadosConquista);

  res.redirect(`/jogos/${id}/conquistas`);
});

// Inicialização do servidor
app.listen(8000, () => {
  console.log("Servidor rodando em http://localhost:8000/");
});

// Conexão com o banco de dados
conn
  .sync({ force: true })
  .then(() => {
    console.log("Conectado ao banco de dados com sucesso! -- http://localhost:8000/");
  })
  .catch((err) => {
    console.error("Ocorreu um erro ao conectar ao banco de dados:", err);
  });