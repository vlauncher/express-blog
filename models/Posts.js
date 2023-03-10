const { Sequelize } = require("sequelize");
const database = require("../config/db");

const Post = database.define('post', {
    title: Sequelize.STRING,
    content: Sequelize.TEXT,
  });


module.exports = Post;