const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:pass@localhost:5432/Programation4');

module.exports = {
    sequelize,
    DataTypes
};