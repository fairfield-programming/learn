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
const Question = require("./question");
const Answer = require("./answer");
const Comment = require("./comment");

// Define Models
global.Question = Question(sequelize, DataTypes);
global.Answer = Answer(sequelize, DataTypes);
global.Comment = Comment(sequelize, DataTypes);

// Setup Relationships
global.Question.hasMany(global.Answer);
global.Answer.belongsTo(global.Question);

global.Question.hasMany(global.Comment);
global.Comment.belongsTo(global.Question);

global.Answer.hasMany(global.Comment);
global.Comment.belongsTo(global.Answer);

global.sequelize = sequelize;
global.Sequelize = Sequelize;