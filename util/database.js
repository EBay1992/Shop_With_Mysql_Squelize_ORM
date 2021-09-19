const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("Your_Database", "root", "YOUR_Password", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
