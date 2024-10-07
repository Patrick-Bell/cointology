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
const sendEmailToUserAfterOrder = async (user) => {
    try{

        const emailContent = `
        Hi ${user.name},<br>
        Thank you for your recent order.

        
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
            to: user.email,
            subject: 'Thank you for your order!',
            html: emailContent
        })


    }catch(e) {

        console.log(e)
    }
}


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

    try{

        let statusText = 'There has been a change in your order status.'

        switch (data.order_status) {
            case 'pending':
            statusText+= 'Your order is now pending. This means that....'
                break;
            case 'shipped': 
            statusText+= 'Your order has now been shipped. This means that...'
            case 'delivery_attempted':
                statusText+= 'We attempted to deliver your order but...'
            case 'delivered':
                statusText+= 'Your order has now been delivered... something about writing reviews etc'
            case 'cancelled':
                statusText+= 'Your order has been cancelled. This means that...'
            default:
                statusText+= `There has been a change in your order. For more information, please visit our website and track your package!`
                break;
        }

        const emailContent = `
        Hi ${data.name},

        There has 
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
            to: data.email,
            subject: 'A new order!',
            html: emailContent
        })


    }catch(e) {

        console.log(e)
    }
}


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