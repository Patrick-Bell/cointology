require('dotenv').config();
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Ensure you have Stripe initialized with your secret key
const path = require('path')
const fs = require('fs')


router.post("/stripe-checkout", async (req, res) => {
    try {
        const lineItems = req.body.items.map((item) => {
            const unitAmount = parseInt(parseFloat(item.price) * 100);

        
            // Check if the image file exists before sending to Stripe
        
            console.log(item)
            
            return {
                price_data: {
                    currency: 'gbp',
                    product_data: {
                        name: item.name,
                        images: [item.front_image]
                    },
                    unit_amount: unitAmount,
                },
                quantity: item.quantity,
            };
        });
        

        console.log(lineItems)

        // Create a Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            shipping_address_collection: {
                allowed_countries: ['GB'],
            },
            shipping_options: [
                // Define your shipping options here
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: { amount: 0, currency: 'gbp' },
                        display_name: 'Free Shipping',
                        delivery_estimate: { minimum: { unit: 'business_day', value: 5 }, maximum: { unit: 'business_day', value: 10 } },
                    },
                },
                // Additional shipping options can be added here
            ],
            phone_number_collection: {
                enabled: true,
            },
            invoice_creation: {
                enabled: true,
            },
            allow_promotion_codes: true,
            mode: "payment",
            success_url: "http://localhost:3001/success",
            cancel_url: "http://localhost:3001/cancel",
            billing_address_collection: "required",
            line_items: lineItems, 
        });

        res.json({ sessionId: session.id, url: session.url });
    } catch (error) {
        console.error('Error creating Stripe checkout session:', error);
        res.status(500).json({ error: 'Error processing payment' });
    }
});

module.exports = router;
