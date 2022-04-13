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

app.get("/article/", require("./routes/article/verified"));
app.get("/article/unverified", require("./routes/article/unverified"));

app.get("/article/:id", require("./routes/article/id"));
app.get("/article/:id/safe", require("./routes/article/safe"));

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
