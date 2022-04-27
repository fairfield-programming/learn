module.exports = (sequelize, DataTypes) => sequelize.define(
    'Article',
    {
      title: DataTypes.TEXT,
      body: DataTypes.TEXT,
      userId: DataTypes.INTEGER,
      username: DataTypes.STRING,
      status: DataTypes.INTEGER
    },
  );
