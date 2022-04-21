// Import Sequelize
const
  {
    Sequelize,
    DataTypes,
    Op,
  } = require("sequelize");

// Setup Global Operator
global.Op = Op;

// Define Sequelize Server
let sequelize;
let env = process.env.NODE_ENV || "development";

// Second Check
if (!process.env.DATABASE_URL) env = "development";

console.log(env);

if (env === "development") {
  sequelize = new Sequelize(
    "sqlite::memory:",
    {
      logging: false,
    },
  );
} else {
  sequelize = new Sequelize(
    process.env.DATABASE_URL,
    {
      logging: false,
      dialectOptions:
      {
        ssl:
        {
          require: true,
          rejectUnauthorized: false,
        },
      },
    },
  );
}

// Import Models
const Article = require("./article");
const Course = require("./course");

// Define Models
global.Article = Article(sequelize, DataTypes);
global.Course = Course(sequelize, DataTypes);

// Setup Relationships
global.Course.belongsToMany(global.Article, { through: 'courseArticles' });
global.Article.belongsToMany(global.Course, { through: 'courseArticles' });

global.sequelize = sequelize;
global.Sequelize = Sequelize;