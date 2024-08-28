const conn = require("../db/conn");
const { DataTypes } = require("sequelize");

const Usuario = require("./Usuario");

const Cartao = conn.define("Cartao", {
    numero: {
        type: DataTypes.STRING(16),
        allowNull: false,
    },
    nome: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    cvv: {
        type: DataTypes.STRING(3),
        allowNull: false,
    }
},{
      tableName: "Cartoes"
})

Cartao.belongsTo(Usuario)
Usuario.hasMany(Cartao)

module.exports = Cartao