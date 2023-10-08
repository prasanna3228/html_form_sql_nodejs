// // Import the required modules.
// const express = require("express");
// const sqlite3 = require("sqlite3").verbose(); // Note: Use 'verbose' to get more information during debugging.

// // Create an Express app.
// const app = express();
// const port = 5500;

// // Middleware to parse incoming JSON data and URL-encoded data.
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// // Create a database connection object.
// const db = new sqlite3.Database("my_database.db", (err) => {
//   if (err) {
//     console.error(err.message);
//   } else {
//     console.log("Connected to SQLite3 database");
//   }
// });

// // Create the 'users' table in the database if it doesn't exist.
// // db.run(`
// //   CREATE TABLE IF NOT EXISTS users (
// //     id INTEGER PRIMARY KEY,
// //     name TEXT NOT NULL,
// //     email TEXT NOT NULL
// //   )
// // `);

// // Create a route to serve the index.html file.
// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/index1.html");
// });

// // Create a route to handle the POST request from the form.
// app.post("/registration", (req, res) => {
//   // Get the form data from the request.
//   const {user_name,user_email,user_password,user_image,total_orders,}=req.body
//   // const name = req.body.name;
//   // const email = req.body.email;

//   // Insert the form data into the database.
//   const sql = `INSERT INTO Users (user_name, user_email,user_password,user_image,total_orders) VALUES (?,?,?,?,?)`;
//   db.run(sql, [user_name, user_email,user_password,user_image,total_orders], (err) => {
//     if (err) {
//       console.log(err);
//       res.status(500).send("Error inserting form data into the database.");
//     } else {
//       console.log("Form data inserted successfully");

//       res.redirect("/");
//     }
//   });
// });

// // Start the Express server.
// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });


// app.get('/image',async (request,response)=>{
//   const getBooksQuery=`
//   select
//   user_image
//    from
//   Users ;`;

//   const booksArray=await db.run(getBooksQuery)
//   response.send(booksArray)
// });

// app.get('/details', async (request, response) => {
//   try {
//     const getBooksQuery = `
//       SELECT
//        *
//       FROM
//         Users
//     `;
  
//     const booksArray = await db.all(getBooksQuery);
//     response.json(booksArray);
//   } catch (error) {
//     console.error(error);
//     response.status(500).json({ error: 'An error occurred while fetching data.' });
//   }
// });


const express = require("express");
const { open } = require("sqlite");
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



app.get("/details", async (request, response) => {
  const getPlayersQuery = `
    SELECT
      *
    FROM
      users;`;
  const playersArray = await database.all(getPlayersQuery);
  response.send(playersArray  );
});

// app.get("/user/:user_id/", async (request, response) => {
//   const { user_id } = request.params;
//   const getPlayerQuery = `
//     SELECT 
//       user_image 
//     FROM 
//       users 
//     WHERE 
//       user_id = ${user_id};`;
//   const player = await database.get(getPlayerQuery);
//   response.send((player));
// });

// // Create a route to serve the index.html file.
app.get("/registration", (req, res) => {
  res.sendFile(__dirname + "/index1.html");
});

// Create a route to handle the POST request from the form.
app.post("/registration", (req, res) => {
  // Get the form data from the request.
  const {user_name,user_email,user_password,user_image,total_orders,}=req.body
  // const name = req.body.name;
  // const email = req.body.email;
  // Insert the form data into the database.
  const sql = `INSERT INTO Users (user_name, user_email,user_password,user_image,total_orders) VALUES (?,?,?,?,?)`;
  database.run(sql, [user_name, user_email,user_password,user_image,total_orders], (err) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error inserting form data into the database.");
    } else {
      console.log("Form data inserted successfully");
      res.redirect("/");
    }
  });
});

app.put("/players/:playerId/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const { playerId } = request.params;
  const updatePlayerQuery = `
  UPDATE
    cricket_team
  SET
    player_name = '${playerName}',
    jersey_number = ${jerseyNumber},
    role = '${role}'
  WHERE
    player_id = ${playerId};`;

  await database.run(updatePlayerQuery);
  response.send("Player Details Updated");
});

app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
  DELETE FROM
    users
  WHERE
    user_id = ${playerId};`;
  await database.run(deletePlayerQuery);
  response.send("user Removed");
});
// module.exports = app;

app.get('/image/:id', async (request, response) => {
    // Get the user ID from the request parameters
    const userId = request.params.user_id;
    // Query the database to retrieve the image data for the specified user
    const getImageQuery = `
      SELECT user_image
      FROM Users
      WHERE user_id = ?
    `;

    const imageRow = await db.get(getImageQuery);

    // Display the image in the response
    response.send(`<img src="${imageSrc}" alt="User Image" />`);
  
});

app.get("/user/:user_id/", async (request, response) => {
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
