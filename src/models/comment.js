module.exports = (sequelize, DataTypes) => sequelize.define(
    'Comment',
    {
      body: DataTypes.TEXT,
      user: DataTypes.INTEGER
    },
  );