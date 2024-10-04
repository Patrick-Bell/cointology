// Load environment variables, express, and other dependencies
require('dotenv').config();
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const { v4: uuidv4 } = require('uuid');
const cookieParser = require('cookie-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

// Middleware for raw body parsing for the webhook
app.use((req, res, next) => {
    if (req.path === '/webhooks') { // Ensure it checks for the correct endpoint
        let data = '';
        req.setEncoding('utf8'); // Set encoding to UTF-8
        req.on('data', (chunk) => {
            data += chunk; // Accumulate the data chunks
        });
        req.on('end', () => {
            req.rawBody = data; // Store raw body in req object
            next(); // Call next middleware
        });
    } else {
        express.json()(req, res, next); // Handle other routes with JSON body parsing
    }
});

// Middleware to handle CORS and cookies
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
const userRoutes = require('./routes/userRoutes');
const favouriteRoutes = require('./routes/favouriteRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/api', productRoutes);
app.use('/api', stripeRoutes);
app.use('/api', userRoutes);
app.use('/api', favouriteRoutes);
app.use('/api', orderRoutes);

// Webhook route
app.post('/webhooks', (request, response) => {
    console.log('Received a webhook request. test to see if ipdates'); // Log the receipt of the request

    const sig = request.headers['stripe-signature'];
    let event;

    try {
        // Verify the signature using the webhook secret
        event = stripe.webhooks.constructEvent(request.rawBody, sig, process.env.STRIPE_SIGNING_SECRET);
        console.log('Webhook signature verified successfully.'); // Log successful verification
    } catch (err) {
        console.error('⚠️  Webhook signature verification failed.', err.message);
        return response.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Log the event type received
    console.log(`Received event type: ${event.type}`);

    // Handle the event types you care about
    switch (event.type) {
        case 'invoice.finalized':
            const invoice = event.data.object;
            console.log('Invoice was finalized:', invoice);
            // Implement your logic here
            break;

        default:
            console.log(`Received unhandled event type: ${event.type}`);
    }

    // Respond to Stripe that the webhook was received
    response.json({ received: true });
});

// Catch-all route to handle all other requests (send to React)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start the server
app.listen(process.env.PORT || 3001, () => {
    console.log(`Server is running on port ${process.env.PORT || 3001}`);
});
