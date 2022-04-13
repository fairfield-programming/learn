module.exports = (sequelize, DataTypes) => sequelize.define(
    'Course',
    {
      title: DataTypes.TEXT,
      description: DataTypes.TEXT,
      user: DataTypes.INTEGER
    },
  );
  