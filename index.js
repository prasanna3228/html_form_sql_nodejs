const express = require("express");
const { open } = require("sqlite");

const bcrypt = require('bcrypt');
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const databasePath = path.join(__dirname, "my_database.db");
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3005, () =>
      console.log("Server Running at http://localhost:3005/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};
initializeDbAndServer();


// // Create a route to serve the index.html file.
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});


app.get('/login',(req,res)=>{
  res.sendFile(__dirname + "/login.html");
})

app.post('/user/login', (req, res) => {
  const { user_email, user_password } = req.body;

  // Query the database for the username and password
  const sql = 'SELECT * FROM Users WHERE user_name = ? AND user_password = ?';
  database.get(sql, [user_email, user_password], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Internal server error' });
      return;
    }

    if (row) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Login failed. Please check your username and password.' });
    }
  });
});


//get all users details
app.get("/details", async (request, response) => {
  const getPlayersQuery = `
    SELECT
      *
    FROM
      users;`;
  const playersArray = await database.all(getPlayersQuery);
  response.send(playersArray  );
});

//get single user details
app.get("/details/:user_id/", async (request, response) => {
  const { user_id } = request.params;
  const getBookQuery = `
    SELECT
      *
    FROM
      users
    WHERE
      user_id = ${user_id};`;
  const book = await database.get(getBookQuery);
  response.send(book);
});



// Create a route to handle the POST request from the form.
app.post("/insert", (req, res) => {
  // Get the form data from the request.
  const {user_name,user_email,user_password,user_image,total_orders,}=req.body
  
  const sql = `INSERT INTO Users (user_name, user_email,user_password,user_image,total_orders) VALUES (?,?,?,?,?)`;
  database.run(sql, [user_name, user_email,user_password,user_image,total_orders], (err) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error inserting form data into the database.");
    } else {
      console.log("Form data inserted successfully");
      res.send("user data insert successfully")
        // res.redirect("/details")
    }
  });
});

//update the user details
app.put("/update/:user_id/", async (req, res) => {
  const {user_name,user_email,user_password,user_image,total_orders,}=req.body
  const { user_id } = req.params;
  const updateUserQuery = `
  UPDATE
    Users
  SET
    user_name = '${user_name}',
    user_email = '${user_email}',
    user_password = '${user_password}',
    user_image = '${user_image}',
    total_orders = '${total_orders}'
  WHERE
    user_id = ${user_id};`;

  await database.run(updateUserQuery);
  res.send("user Details Updated");
});




app.get("/image/:user_id/", async (request, response) => {
  try {
    const { user_id } = request.params;
    const getPlayerQuery = `
      SELECT 
        user_image 
      FROM 
        users 
      WHERE 
      user_id = ?`;
    const image = await database.get(getPlayerQuery, [user_id]);
    if (image) {
      response.send(`<img src="${image.user_image}" alt="User Image" />`);
    } else {
      response.status(404).send("User not found");
    }
  } catch (error) {
    console.error("Error fetching user image:", error);
    response.status(500).send("Internal Server Error");
  }
});

app.delete("/user/:user_id/", async (request, response) => {
  const { user_id } = request.params;
  const deletePlayerQuery = `
  DELETE FROM
    users
  WHERE
    user_id = ${user_id};`;
  await database.run(deletePlayerQuery);
  response.send("user Removed");
});
