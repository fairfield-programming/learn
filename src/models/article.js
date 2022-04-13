module.exports = (sequelize, DataTypes) => sequelize.define(
    'Article',
    {
      title: DataTypes.TEXT,
      body: DataTypes.TEXT,
      user: DataTypes.INTEGER,
      verified: DataTypes.BOOLEAN
    },
  );
