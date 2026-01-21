const mongoose = require('mongoose');
const FoodItem = require('./models/FoodItem');
const dotenv = require('dotenv');

dotenv.config();

const fixMurukku = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        await mongoose.connect(MONGODB_URI);

        // 1. Update Category
        const res = await FoodItem.updateOne(
            { name: 'Murukku' },
            { $set: { category: 'Snack' } }
        );

        console.log(`Update Result:`, res);

        // Verify
        const item = await FoodItem.findOne({ name: 'Murukku' });
        console.log(`Current Category: ${item.category}`);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fixMurukku();
