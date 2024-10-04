const mongoose = require('mongoose')

const reviewSchema = mongoose.Schema({
    id: String,
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    rating_number: { type: Number, min: 1, max: 5 },
    rating_message: String,
    date: { type: Date, default: Date.now() }
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review