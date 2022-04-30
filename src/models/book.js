module.exports = (sequelize, DataTypes) => sequelize.define(
    'Book',
    {
        title: DataTypes.TEXT,
        isbn: DataTypes.STRING,
        state: DataTypes.INTEGER,
        content: DataTypes.JSON
    },
);
