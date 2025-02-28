import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import env from "dotenv";

const app = express();
const port = 3000;
env.config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

db.connect();

let test1 = "This is a test!";

app.get("/", async (req, res) => {
  res.render("home.ejs", {
      test: test1
    });
});

app.post("/submit", async (req, res) => {
  const entry = req.body.entry;
  await db.query(
    "INSERT INTO test (name) VALUES($1);",
    [entry]
  );
  console.log(`Added to database: ${entry}`)
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
