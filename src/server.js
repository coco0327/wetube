import express from "express";
import morgan from "morgan";

const PORT = 8062;

const app = express();
const logger = morgan("dev");

app.set("veiw engine", "ejs");

const home = (req, res) => {
  return res.send("HomePage");
};

const login = (req, res) => {
  return res.send("loginPage");
};

app.use(logger);
app.get("/", home);
app.get("/login", login);

app.get("/login", (req, res) => {
  return res.send("login here!");
});

app.listen(PORT, () =>
  console.log(`✅ Server Listening on Port http://localhost:${PORT} 🤡`)
);
