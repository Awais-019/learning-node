const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const config = require("config");
const startUpDebugger = require("debug")("app:startup");
const logger = require("./middlewares/logger");
const authenticator = require("./middlewares/authenticater");
const home = require("./routes/home");
const courses = require("./routes/courses");

const app = express();
app.use(express.json());

app.use(logger);

app.use(authenticator);
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());
app.use("/", home);
app.use("/api/courses", courses);

app.set("view engine", "pug");
app.set("views", "./views");

console.log("Application Name: " + config.get("name"));
console.log("Mail Server: " + config.get("mail.host"));

if (app.get("env") == "development") {
  app.use(morgan("tiny"));
  startUpDebugger("Morgan enabled...");
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
