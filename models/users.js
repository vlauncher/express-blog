const { DataTypes } = require("sequelize");
const database = require("../config/db");
const Comments = require("./comments");
const Like = require("./Likes");
const Post = require("./Posts");

const User = database.define('user', {
    name:{
        type:DataTypes.STRING
    },
    email:{
        type:DataTypes.STRING
    },
    password:{
        type:DataTypes.STRING
    },
    role:{
        type:DataTypes.STRING
    },
});

User.hasMany(Post);
Post.belongsTo(User);
Post.hasMany(Comments);
Comments.belongsTo(Post);
Comments.belongsTo(User);
Post.belongsToMany(User, { through: Like });
User.belongsToMany(Post, { through: Like });

module.exports = User;