const { DataTypes } = require("sequelize");
const database = require("../config/db");

const Comments = database.define('Comments',{
    content: DataTypes.TEXT
})

module.exports = Comments;