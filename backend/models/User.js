const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    id: String,
    name: String,
    email: String,
    password: String,
    address_line_1: String,
    post_code: String,
    phone_number: Number,
    favourites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Favourite' }],
    reviews: [],
    messages: [],
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
    role: { type: String, default: 'user' }
})

const User = mongoose.model('User', userSchema)

module.exports = User