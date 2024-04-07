//Basic Imports
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2'); //Using mysql2 to avoid security for admin 

//Creating express app at 3000 port
const app = express();
const port = 3000;

//Middleware to use bodyParser to JSON for request bodies
app.use(bodyParser.json());

//Creating MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password123',
  database: 'railway_management'
});

//Connecting to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL: ' + err.stack);
    return;
  }
  console.log('Connected to MySQL with id: ' + connection.threadId);
});

//Registering a new user
app.post('/register', (req, res) => {
  const { username, password, role } = req.body;
  const sql = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
  connection.query(sql, [username, password, role], (err, result) => {
    if (err) {
      console.error('Error registering user: ' + err.message);
      res.status(500).send('Error registering user');
      return;
    }
    res.status(200).send('User registered successfully');
  });
});

//Login of user
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
  connection.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error('Error logging in: ' + err.message);
      res.status(500).send('Error logging in');
      return;
    }
    if (results.length === 0) {
      res.status(401).send('Invalid username or password');
      return;
    }
    // Generate and return an authorization token
    res.status(200).json({ token: username });
  });
});

//Add a new train accessible to admin
app.post('/trains', (req, res) => {
  const { source, destination } = req.body;
  //Validate admin API key
  const apiKey = req.headers['api-key'];
  if (apiKey !== 'your_api_key') {
    res.status(401).send('Unauthorized');
    return;
  }
  const sql = 'INSERT INTO trains (source, destination) VALUES (?, ?)';
  connection.query(sql, [source, destination], (err, result) => {
    if (err) {
      console.error('Error adding train: ' + err.message);
      res.status(500).send('Error adding train');
      return;
    }
    res.status(200).send('Train added successfully');
  });
});

//Get seat availability for trains between source and destination
app.get('/availability', (req, res) => {
  const { source, destination } = req.query;
  const sql = 'SELECT * FROM trains WHERE source = ? AND destination = ?';
  connection.query(sql, [source, destination], (err, results) => {
    if (err) {
      console.error('Error fetching seat availability: ' + err.message);
      res.status(500).send('Error fetching seat availability');
      return;
    }
    res.status(200).json(results);
  });
});

//Book a seat on a particular train
app.post('/book', (req, res) => {
  const { trainId, authToken } = req.body;
  //Validate authorization token
  if (!authToken) {
    res.status(401).send('Unauthorized');
    return;
  }
  //Perform booking logic
  res.status(200).send('Seat booked successfully');
});

//Get specific booking details
app.get('/booking/:bookingId', (req, res) => {
  const bookingId = req.params.bookingId;
  //Fetch booking details from database using bookingId
  res.status(200).json(bookingDetails);
});

//Starting the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
