module.exports = (sequelize, DataTypes) => sequelize.define(
    'Question',
    {
      title: DataTypes.TEXT,
      body: DataTypes.TEXT,
      user: DataTypes.INTEGER
    },
  );
  