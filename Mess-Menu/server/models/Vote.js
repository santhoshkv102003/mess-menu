const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    month: {
        type: String, // "YYYY-MM"
        required: true
    },
    week: {
        type: Number,
        default: 1
    },
    type: {
        type: String,
        enum: ['monthly_selection', 'feedback', 'replacement'],
        // monthly_selection: Initial vote for 28 items
        // feedback: Select 3 disliked items from current menu
        // replacement: Select 3 new items to add
        required: true
    },
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FoodItem'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Vote', voteSchema);
