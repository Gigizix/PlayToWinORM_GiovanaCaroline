const conn=require("../db/conn");
const {DataType, DataTypes}=require('sequelize');

const Usuario = conn.define('Usuario',{
    nickname:{
        type:DataTypes.STRING,
        required:false
    },
    nome:{
        type:DataTypes.STRING,
        required:true
    }
});

module.exports = Usuario;