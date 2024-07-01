const conn=require("../db/conn");
const {DataType, DataTypes}=require('sequelize');

const Jogo = conn.define('Jogo',{
    titulo:{
        type:DataTypes.STRING,
        required:false
    },
    descricao:{
        type:DataTypes.STRING,
        required:false
    },
    precoBase:{
        type:DataTypes.DOUBLE,
        required:false
    },
});

module.exports = Jogo;