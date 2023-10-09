const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const app = express();
const databasePath = path.join(__dirname, "my_database.db");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set("view engine", "ejs"); // Set EJS as the view engine
app.set("views", path.join(__dirname, "views")); // Specify the views directory
app.use(express.static(path.join(__dirname, 'public')));


let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();

app.get("/", async (request, response) => {
  try {
    const getUsersQuery = `
      SELECT
        *
      FROM
        users;`;

    const users = await database.all(getUsersQuery);
    response.render("table", { users }); // Render the "table.ejs" template and pass the users data
  } catch (error) {
    console.error(error);
    response.status(500).send("Internal Server Error");
  }
});
