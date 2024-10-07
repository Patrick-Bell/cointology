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

    try{

        const emailContent = `
        
        Include:
        - new order
        - customer details
        - order id
        - coins purchased
        - price
        - whether it is a user, or a guess
        - maybe a link to the page or at least the orders page
        `

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            }
        })

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: process.env.EMAIL,
            subject: 'A new order!',
            html: emailContent
        })


    }catch(e) {

        console.log()
    }
}




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
    try{

        const orders = await Orders.find()

        const lowOrders = orders.filter(order => order.stock <= 10)
        const numberOfLowOrders = lowOrders.length

        const today = Date.now()
        const sevenDaysAgo = new Date(today.getDate() - 7)

        const formattedToday = new Date(today).toLocaleDateString()
        const formattedSevenDaysAgo = new Date(sevenDaysAgo).toLocaleDateString()

        const emailContent = `
        
        `

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASS
            }
        })



        await transporter.sendMail({
            from: process.env.EMAIL,
            to: process.env.PASS,
            subject: 'Weekly Stock Report',
            html: emailContent
        })

    }catch(e) {
        console.log(e)
    }
}

module.exports = { sendEmailToAdminAfterOrder, sendEmailToUserAfterOrder, sendEmailAfterStatusChange, sendWeeklyStockUpdate }