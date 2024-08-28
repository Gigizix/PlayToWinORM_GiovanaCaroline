const db = require("../db/conn")
const {DataTypes} = require("sequelize")

const Usuario = db.define("Usuario",{
    nickname:{
        type: DataTypes.STRING,
        resquire: true
    },
    nome:{
        type:DataTypes.STRING,
        require: true
    }
});

module.exports = Usuario