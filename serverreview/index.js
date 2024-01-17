const express = require('express');
const jsonServer = require('json-server');
const multer = require('multer');
// const path = require('path');

const app = express();
const port = 7000;

// Middleware to parse JSON bodies
app.use(express.json());

// Set up multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Adjust the destination folder as needed
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname +file.originalname);
  }
});

const upload = multer({ storage: storage });

// Create a json-server instance
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

// Use middlewares and router
server.use(middlewares);
server.use(router);

// Create a route to handle POST requests for reviews with image upload
app.post('/patient', upload.single('imguser'), (req, res) => {
  const review = req.body;
  const imguser = req.file.filename;

  // Handle the image as needed, e.g., save it to disk or process it

  // Add the new review to the database
  router.db.get('patient').push({ ...review, imguser }).write();

  // Respond with the added review
  res.json({ ...review, imguser });
});

// Mount json-server on the root path
app.use('/', server);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
