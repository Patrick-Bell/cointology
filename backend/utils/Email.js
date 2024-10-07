/*
Email routes (customer)

1. When an order is placed
2. When the status changes in an order
3. Automated email to let user know their message has been sent
4. When a user signs up
5. When a user changes thier password
6. When a new limited edition item gets put on the shop


Email routes (admin)

1. When a new order is made
2. When a product stock drops below 5
3. Weekly stock updates
4. Weekly order updates
5. When a customer sends in a message
*/

require('dotenv').config()
const nodemailer = require('nodemailer')
const Orders = require('../models/Order')
const Products = require('../models/Product')
const User = require('../models/User')


// Function to send email to all users when a new limited product is released
const sendEmailWhenNewLimitedProductReleases = async (product) => {
    try {
        // Fetch all users
        const users = await User.find();

        // Check if the product is tagged as 'limited'
        if (product.tags.includes('limited')) {

            // Construct email content including the image
            let emailContent = `
                <div style="background-color: #f9f9f9; padding: 20px; font-family: Arial, sans-serif;">
                    <h2 style="color: #333;">Exciting News! A New Limited Edition Product is Available</h2>
                    <p style="color: #555;">We're excited to announce the release of a new limited edition product: <strong>${product.name}</strong>.</p>
                    <p style="color: #555;">Get yours before it's gone! Only limited stock is available.</p>
                    
                    <h3 style="color: #333;">Product Details:</h3>
                    <ul style="color: #555;">
                        <li><strong>Price:</strong> £${product.price}</li>
                        <li><strong>Description:</strong> ${product.description ? product.description : 'Limited Stock Available'}</li>
                        <li><strong>Category:</strong> ${product.category}</li>
                    </ul>

                    <!-- Image Inclusion -->
                    <div style="text-align: center; margin: 20px 0;">
                        <img src="${product.front_image}" alt="${product.name}" style="max-width: 100%; height: auto; border-radius: 10px;" />
                    </div>

    
                    
                    <p style="color: #888;">Thank you for shopping with us!</p>

                    <footer style="margin-top: 20px; padding: 10px; background-color: #007BFF; color: white; text-align: center; border-radius: 5px;">
                <p style="margin: 0;">Best Regards,<br>Your Company Name</p>
                    </footer>

                </div>
            `;

            // Setup email transporter
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASS,
                },
            });

            // Send the email to each user
            for (const user of users) {
                await transporter.sendMail({
                    from: process.env.EMAIL,
                    to: user.email,
                    subject: 'New Limited Product Available!',
                    html: emailContent,
                });
            }

            console.log('Emails sent successfully to all users!');
        }

    } catch (e) {
        console.error('Error sending limited product email:', e);
    }
};



// Function to send email to user after an order
const sendEmailToUserAfterOrder = async (orderData) => {
    try {
        // Create a detailed order summary
        const orderSummary = orderData.line_items.map(item => {
            return `
            <tr style="text-align: center; border: 1px solid #ccc;">
                <td style="padding: 10px; border-bottom: 1px solid #ccc;">${item.name}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ccc;">${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ccc;">£${item.unit_price.toFixed(2)}</td>
            </tr>
            `;
        }).join('');

        const emailContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4; padding: 20px; border-radius: 8px;">
            <h2 style="color: #333;">Hi ${orderData.name},</h2>
            <p>Thank you for your recent order! We are excited to get your items shipped to you. Your order number is <span style="color: #007BFF"> ${orderData.order_id}</span></p>

            <h3 style="color: #444;">Order Summary:</h3>
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; border-radius: 5px; overflow: hidden;">
                <thead>
                    <tr style="background-color: #007BFF; color: white; text-align: center; border: 1px solid #ccc;">
                        <th style="padding: 12px">Product</th>
                        <th style="padding: 12px">Quantity</th>
                        <th style="padding: 12px">Price</th>
                    </tr>
                </thead>
                <tbody>
                    ${orderSummary}
                </tbody>
            </table>

            <p style="font-weight: bold;">Shipping Address:</p>
            <p>${orderData.shipping_address.address_line_1}<br>
               ${orderData.shipping_address.address_line_2 ? orderData.shipping_address.address_line_2 + '<br>' : ''}
               ${orderData.shipping_address.city}<br>
               ${orderData.shipping_address.postal_code}<br>
               United Kingdom
            </p>
            <br>
            <p>If you notice a mistake in your shipping address, please reach out as soon as possible. Once the order is shipped, it will be too late.</p>

            <h3 style="color: #444;">Shipping Fee: £${(orderData.shipping / 100).toFixed(2)}</h3>
            <h3 style="color: #444;">Total Price: £${orderData.total_price.toFixed(2)}</h3>

            <p>We will notify you as soon as your order is on its way!</p>
            <p>If you have any questions, feel free to reach out.</p>

            <p>Thank you for shopping with us!</p>

            <footer style="margin-top: 20px; padding: 10px; background-color: #007BFF; color: white; text-align: center; border-radius: 5px;">
                <p style="margin: 0;">Best Regards,<br>Your Company Name</p>
            </footer>
        </div>
        `;

        // Send email using nodemailer (this part remains unchanged)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: orderData.email,
            subject: 'Thank you for your order!',
            html: emailContent
        });

    } catch (e) {
        console.log(e);
    }
};




// Function to send email to admin after an order
const sendEmailToAdminAfterOrder = async (orderData) => {
    try {
        // Create a table row for each line item in the order
        const orderSummary = orderData.line_items.map(item => {
            return `
            <tr style="text-align: center; border: 1px solid #ccc;">
                <td style="padding: 10px; border-bottom: 1px solid #ccc;">${item.name}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ccc;">${item.quantity}</td>
                <td style="padding: 10px; border-bottom: 1px solid #ccc;">£${item.unit_price.toFixed(2)}</td>
            </tr>
            `;
        }).join('');

        // Prepare email content
        const emailContent = `
            <div style="font-family: Arial, sans-serif; color: #333;">
                <h2>New Order Notification</h2>
                <p>A new order has been placed:</p>

                <h3>Order Details</h3>
                <ul>
                    <li><strong>Order ID:</strong> ${orderData.order_id}</li>
                    <li><strong>Customer:</strong> ${orderData.name} (${orderData.email})</li>
                    <li><strong>Account Type:</strong> ${orderData.user ? 'Registered User' : 'Guest'}</li>
                </ul>

                <h3>Order Summary</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr>
                            <th style="padding: 10px; border: 1px solid #ccc;">Product Name</th>
                            <th style="padding: 10px; border: 1px solid #ccc;">Quantity</th>
                            <th style="padding: 10px; border: 1px solid #ccc;">Unit Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orderSummary}
                    </tbody>
                </table>

                <h3>Total Price</h3>
                <p style="font-size: 16px;"><strong>Total:</strong> £${orderData.total_price.toFixed(2)}</p>

                <p>You can view this order in the admin panel:</p>
                <a href="https://yourwebsite.com/admin/orders/${orderData.order_id}" style="color: #007bff;">View Order</a>
                <br>
                <a href="https://yourwebsite.com/admin/orders" style="color: #007bff;">Go to Orders Page</a>

                <p>Best regards,<br>Your Store</p>
            </div>
        `;

        // Set up email transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS,
            },
        });

        // Send the email
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: process.env.EMAIL, // Admin email
            subject: 'A New Order Has Been Placed!',
            html: emailContent,
        });

        console.log('Order notification email sent successfully.');

    } catch (e) {
        console.error('Error sending order notification email:', e);
    }
};





// Function to send email to user after a status change in their order
const sendEmailAfterStatusChange = async (data) => {
    try {
        let statusText = 'There has been a change in your order status. ';

        switch (data.order_status) {
            case 'pending':
                statusText += 'Your order is now <strong>pending</strong>. This means that we have received your order, and it is currently being processed. We will notify you once it has been shipped.';
                break;
            case 'shipped':
                statusText += `Your order has now been <strong>shipped</strong>! <br><br>Expected Delivery Date: ${(data.estimated_delivery.latestDate).toLocaleDateString()}. <br><br>To track your package in real time, please click <a href="http://localhost:3001/cart">here</a> and enter your order ID`;
                break;
            case 'delivery_attempted':
                statusText += 'We attempted to deliver your order but were unable to do so. Please check your delivery address and ensure that someone is available to receive it. If you have any questions, feel free to contact us.';
                break;
            case 'delivered':
                statusText += 'Your order has now been <strong>delivered</strong>! We hope you enjoy your purchase. If you have a moment, we would appreciate your feedback on our service. Please consider leaving a review.';
                break;
            case 'cancelled':
                statusText += 'Your order has been <strong>cancelled</strong>. This could be due to various reasons, such as stock availability or customer request. If you believe this is an error, please reach out to our customer service.';
                break;
            default:
                statusText += 'There has been a <strong>change</strong> in your order. For more information, please visit our website and track your package!';
                break;
        }

        const emailContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.5; background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
            <h2 style="color: #333;">Hi ${data.name},</h2>
            <p>${statusText}</p>
            <p>If you have any further questions or concerns, feel free to reply to this email or contact our customer service team.</p>
            <p>Thank you for choosing us!</p>
            
            <footer style="margin-top: 20px; padding: 10px; background-color: #007BFF; color: white; text-align: center; border-radius: 5px;">
                <p style="margin: 0;">Best Regards,<br>Your Company Name</p>
            </footer>

        </div>
        `;

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: data.email,
            subject: 'Order Status Update',
            html: emailContent
        });

    } catch (e) {
        console.log(e);
    }
};



const sendWeeklyStockUpdate = async () => {
    try {
        // Fetch all orders from the database
        const products = await Products.find();

        // Filter orders with stock less than or equal to 10
        const lowStock = products.filter(product => product.stock <= 10);
        const numberOfLowProducts = lowStock.length;

        // Constructing the email content with a background color
        let emailContent = `
            <div style="background-color: #f4f4f4; padding: 20px; border-radius: 8px;">
                <h1 style="color: #333;">Weekly Stock Report</h1>
                <p style="color: #555;">Dear Team,</p>
        `;

        // Check if there are low stock orders
        if (numberOfLowProducts > 0) {
            emailContent += `
                <p style="color: #555;">Here is the update on the stock levels:</p>
                <p style="color: #555;">Total Low Stock Items: <strong>${numberOfLowProducts}</strong></p>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <tr>
                        <th style="border: 1px solid #ccc; padding: 8px; background-color: #eee;">Order ID</th>
                        <th style="border: 1px solid #ccc; padding: 8px; background-color: #eee;">Stock Level</th>
                    </tr>
            `;

            // Add each low stock order to the email content
            lowStock.forEach(product => {
                emailContent += `
                    <tr>
                        <td style="border: 1px solid #ccc; padding: 8px; text-align: center">${product.name}</td>
                        <td style="border: 1px solid #ccc; padding: 8px; text-align: center">${product.stock}</td>
                    </tr>
                `;
            });

            emailContent += `</table>`;
        } else {
            // Message for when there are no low stock items
            emailContent += `
                <p style="color: #555;">There are currently no items with low stock levels.</p>
            `;
        }

        emailContent += `<p style="color: #555;">Regards,<br>Your Inventory Management System</p></div>`;

        // Setup the email transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            }
        });

        // Send the email
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: process.env.EMAIL, // Send to your email (or other recipient)
            subject: 'Weekly Stock Report',
            html: emailContent
        });

        console.log('Weekly stock report email sent successfully.');

    } catch (e) {
        console.error('Error sending email:', e);
    }
};



const sendWeeklyOrdersReport = async () => {
    try {
        const today = new Date(); // Current date
        const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days ago

        // Fetch all orders from the database where the order date is within the last 7 days
        const lastWeekOrders = await Orders.find({
            order_date: {
                $gte: sevenDaysAgo,
                $lte: today
            }
        });

        const numberOfOrders = lastWeekOrders.length;
        const totalIncome = lastWeekOrders.reduce((sum, order) => sum + order.total_price, 0);

        // Build the table rows dynamically
        let tableRows = '';
        for (const order of lastWeekOrders) {
            const orderDate = new Date(order.order_date).toLocaleDateString('en-GB'); // Format the date to DD/MM/YYYY
            const totalPrice = `£${(order.total_price)}`; // Assuming total_amount is a field in the schema
            const orderLink = `https://cointology.onrender.com/${order._id}`; // Replace with your order page URL

            tableRows += `
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center">${orderDate}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center">${totalPrice}</td>
                    <td style="border: 1px solid #ddd; padding: 8px; text-align: center">
                        <a href="${orderLink}" style="color: #1a73e8; text-decoration: none;">Click Here</a>
                    </td>
                </tr>
            `;
        }

        // Design the email content
        const emailContent = `
            <div style="background-color: #f4f4f4; padding: 20px; border-radius: 8px;">
                <h2>Weekly Orders Report</h2>
                <p>Here is the summary of the orders for the last 7 days:</p>
                <p>Start: ${sevenDaysAgo.toLocaleDateString('en-GB')}</p>
                <p>End: ${today.toLocaleDateString('en-GB')}</p><br>
                <p><strong>Total Income: £${(totalIncome).toFixed(2)}</strong></p>
                <p><strong>Total Orders: ${numberOfOrders}</strong></p>

                <table style="border-collapse: collapse; width: 100%;">
                    <thead>
                        <tr>
                            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Date</th>
                            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Total Price</th>
                            <th style="border: 1px solid #ddd; padding: 8px; background-color: #f2f2f2;">Order Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
                <br>

                <footer style="margin-top: 20px; padding: 10px; background-color: #007BFF; color: white; text-align: center; border-radius: 5px;">
                <p style="margin: 0;">Best Regards,<br>Your Company Name</p>
                    </footer>
            </div>
        `;

        // Setup the email transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            }
        });

        // Send the email
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: process.env.EMAIL, // Send to your email (or other recipient)
            subject: 'Weekly Order Report',
            html: emailContent
        });

        console.log('Weekly order report email sent successfully.');

    } catch (e) {
        console.error('Error sending email:', e);
    }
};

sendWeeklyOrdersReport();



// Call the function (for testing purposes)

module.exports = { sendEmailToAdminAfterOrder, sendEmailToUserAfterOrder, sendEmailAfterStatusChange, sendWeeklyStockUpdate, sendEmailWhenNewLimitedProductReleases }