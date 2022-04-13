require('dotenv').config();

// Configure Imports
const express = require('express');
const { Sequelize } = require('sequelize');
const models = require('./models');

// Configure Local Variables
const app = express();
const port = process.env.PORT || 8080;

// Configure Middleware
app.use(express.json());
app.use(require("cors")({ origin: "*" }));

// Endpoints
app.get("/", require('./routes/index'));

app.get("/question", require('./routes/question/index'));
app.get("/question/recent", require('./routes/question/recent'));
app.get("/question/unanswered", require('./routes/question/unanswered'));

app.get("/question/:id/", require('./routes/question/id'));
app.post("/question/:id/answer", require('./routes/answer/create'));
app.get("/question/:id/related", require('./routes/question/related'));

app.post("/question/post", require('./routes/question/create'));

app.get("/answer/:id/", require('./routes/answer/id'));

app.get("/user/:id/questions", require('./routes/user/questions'));
app.get("/user/:id/answers", require('./routes/user/answers'));

// Sync the Database
(async () => {

    await sequelize.sync().then(() => { app.emit('database-started'); });

})()

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    // Log Server Port to the Console.
    console.log(`Server Listening at http://localhost:${port}`);
  });
}

module.exports = app;
