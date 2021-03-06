require('dotenv').config();

// Configure Imports
const express = require('express');
const { verify } = require('jsonwebtoken');
const { Sequelize } = require('sequelize');
const models = require('./models');

// Configure Local Variables
const app = express();
const port = process.env.PORT || 8080;

// Configure Middleware
app.use(express.json());
app.use(require("cors")({ origin: "*" }));

// Custom Middleware
const authMiddleware = (req, res, next) => {
  
  let header = req.get("Authorization") || "";
  let parts = header.split(" ");
  
  if (parts.length != 2) return res.status(403).send("Not Logged In.");
  
  let token = parts[1];
  
  verify(token, process.env.JWT_KEY, (err, userData) => {
    if (err) return res.status(400).send(err.message);
    req.user = userData;
    next();
  })
  
};

// Endpoints
app.get("/", require('./routes/index'));

app.get("/course/:id", require("./routes/course/id"));

app.get("/book/create", require("./routes/book/create"));
app.get("/book/:id/", require("./routes/book/id"));
app.get("/book/:id/generate", require("./routes/book/generate"));

app.get("/article/", require("./routes/article/verified"));
app.get("/article/unverified", require("./routes/article/unverified"));

app.get("/article/:id", require("./routes/article/id"));
app.get("/article/:id/safe", require("./routes/article/safe"));
app.get("/article/:id/possibleCourses", require("./routes/article/suggestedCoursesForArticle"))
app.post("/article/:id/update", require("./routes/article/update"));
app.post("/article/create", authMiddleware, require('./routes/article/create'));

app.post("/utility/text", require("./routes/utility/checkText"));
app.post("/utility/markdown/meta", require("./routes/utility/markdownMeta"));
app.post("/utility/markdown", require("./routes/utility/markdown"));

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
