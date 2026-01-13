const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
    month: {
        type: String, // Format: "YYYY-MM"
        required: true
    },
    week: {
        type: Number, // 1, 2, 3, 4
        default: 1
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FoodItem'
    }], // Should contain 28 items
    isLocked: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);
