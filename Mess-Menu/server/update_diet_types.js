const mongoose = require('mongoose');
const FoodItem = require('./models/FoodItem');
const dotenv = require('dotenv');

dotenv.config();

const classifyItems = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/mess_menu_db');
        console.log('MongoDB Connected');

        const items = await FoodItem.find({});
        const nonVegKeywords = ['chicken', 'fish', 'egg', 'omelette', 'puff', 'non-veg'];

        for (const item of items) {
            const lowerName = item.name.toLowerCase();
            let dietType = 'Veg';

            if (nonVegKeywords.some(kw => lowerName.includes(kw))) {
                dietType = 'Non-Veg';
            }

            // Exceptions or specific overrides if needed
            if (lowerName.includes('bonda') || lowerName.includes('bajji')) dietType = 'Veg';

            item.dietType = dietType;
            await item.save();
            console.log(`Updated ${item.name} -> ${dietType}`);
        }

        console.log('Diet classifications updated!');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

classifyItems();
