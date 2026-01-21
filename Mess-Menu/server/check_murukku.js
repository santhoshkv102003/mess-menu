const mongoose = require('mongoose');
const FoodItem = require('./models/FoodItem');
const Menu = require('./models/Menu');
const dotenv = require('dotenv');

dotenv.config();

const checkMurukku = async () => {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        await mongoose.connect(MONGODB_URI);

        const item = await FoodItem.findOne({ name: 'Murukku' });
        if (!item) {
            console.log('Murukku not found in FoodItems');
        } else {
            console.log(`Murukku found: Category=${item.category}, Diet=${item.dietType}, ID=${item._id}`);
        }

        const menu = await Menu.findOne().sort({ createdAt: -1 }); // Get latest menu
        if (menu) {
            // Check if it's in the menu
            const isInMenu = menu.items.includes(item?._id);
            console.log(`Is in Menu: ${isInMenu}`);

            if (isInMenu && item) {
                // Find which slot/day
                // menu.items is flat array of 28 items (4 per day * 7 days)
                // 0=Bk, 1=Ln, 2=Sn, 3=Dn
                const index = menu.items.indexOf(item._id);
                const dayIndex = Math.floor(index / 4);
                const mealIndex = index % 4;
                const meals = ['Breakfast', 'Lunch', 'Snack', 'Dinner'];
                console.log(`Found in Menu at Day ${dayIndex}, Meal: ${meals[mealIndex]}`);
            }
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkMurukku();
