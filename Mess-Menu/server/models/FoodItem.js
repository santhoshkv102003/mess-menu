const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        enum: ['Breakfast', 'Lunch', 'Snack', 'Dinner'],
        required: true
    },
    image: {
        type: String, // URL or placeholder
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('FoodItem', foodItemSchema);
