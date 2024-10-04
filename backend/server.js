
// Load environment variables, express, and other dependencies
require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose')
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const { v4: uuidv4 } = require('uuid');
const cookieParser = require('cookie-parser')

const app = express();

// Middleware to handle JSON and URL-encoded data
app.use(express.json());
app.use(cors());
app.use(cookieParser());


// Serve the static files from the 'uploads' folder
app.use(express.static(path.join(__dirname, 'build')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log('Uploads served from:', path.join(__dirname, 'uploads'));


const uri = process.env.MONGO_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Connection error', error));


// Define your API routes here
const productRoutes = require('./routes/productRoutes');
const stripeRoutes = require('./routes/stripeRoutes');
const userRoutes = require('./routes/userRoutes')
const favouriteRoutes = require('./routes/favouriteRoutes')
const orderRoutes = require('./routes/orderRoutes')
app.use('/api', productRoutes);
app.use('/api', stripeRoutes);
app.use('/api', userRoutes)
app.use('/api', favouriteRoutes)
app.use('/api', orderRoutes)

/*
const createUser = async (username, password) => {
  try{
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newUser = new User({
          id: uuidv4(),
          username,
          password: hashedPassword,
          email: 'patrickbell1302@gmail.com',
          address_line_1: 'Test Street',
          postal_code: 'E2 0GS',
          phone_number: '07710298283',
          reviews: [],
          favourites: [],
          orders: [],
          messages: [],
          role: 'user'
      });

      await newUser.save()

  }catch(e) {
      console.log(e)
  }
}

createUser('Patrick', 'zxasqw12')
*/


// Catch-all route to handle all other requests (send to React)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(process.env.PORT || 3001, () => {
  console.log(`Server is running on port ${process.env.PORT || 3001}`);
});
