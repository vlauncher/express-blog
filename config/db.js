const { Sequelize } = require("sequelize");


const database = new Sequelize({
    dialect:"sqlite",
    storage:"db.sqlite3"
});

database.sync();

module.exports = database;