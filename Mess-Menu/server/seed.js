const mongoose = require('mongoose');
const dotenv = require('dotenv');
const FoodItem = require('./models/FoodItem'); // Adjust path if needed

dotenv.config();

const foodItems = [
    // Morning Breakfast
    { name: "Idli with Sambar", category: "Breakfast" },
    { name: "Plain Dosa", category: "Breakfast" },
    { name: "Masala Dosa", category: "Breakfast" },
    { name: "Pongal", category: "Breakfast" },
    { name: "Poori with Potato Masala", category: "Breakfast" },
    { name: "Upma", category: "Breakfast" },
    { name: "Rava Dosa", category: "Breakfast" },
    { name: "Appam with Coconut Milk", category: "Breakfast" },
    { name: "Puttu with Kadala Curry", category: "Breakfast" },
    { name: "Egg Omelette", category: "Breakfast" },

    // Afternoon Lunch
    { name: "Veg Meals (Rice, Sambar, Poriyal, Appalam)", category: "Lunch" },
    { name: "Sambar Rice", category: "Lunch" },
    { name: "Rasam Rice", category: "Lunch" },
    { name: "Curd Rice", category: "Lunch" },
    { name: "Lemon Rice", category: "Lunch" },
    { name: "Vegetable Biryani", category: "Lunch" },
    { name: "Kootu with Rice", category: "Lunch" },
    { name: "Chicken Curry with Rice", category: "Lunch" },
    { name: "Chicken Biryani", category: "Lunch" },
    { name: "Chicken Fry", category: "Lunch" },
    { name: "Fish Curry with Rice", category: "Lunch" },
    { name: "Fish Fry", category: "Lunch" },

    // Evening Snacks
    { name: "Bajji", category: "Snack" },
    { name: "Bonda", category: "Snack" },
    { name: "Samosa", category: "Snack" },
    { name: "Sundal (Channa / Peanut)", category: "Snack" },
    { name: "Vada", category: "Snack" },
    { name: "Mixture", category: "Snack" },
    { name: "Bread Omelette", category: "Snack" },
    { name: "Egg Puff", category: "Snack" },

    // Night Dinner
    { name: "Chapati with Veg Kurma", category: "Dinner" },
    { name: "Parotta with Veg Salna", category: "Dinner" },
    { name: "Idiyappam with Kurma", category: "Dinner" },
    { name: "Lemon Sevai", category: "Dinner" },
    { name: "Vegetable Fried Rice", category: "Dinner" },
    { name: "Dosa with Chutney", category: "Dinner" },
    { name: "Parotta with Chicken Salna", category: "Dinner" },
    { name: "Chapati with Chicken Gravy", category: "Dinner" },
    { name: "Chicken Fried Rice", category: "Dinner" },
    { name: "Fish Gravy with Rice", category: "Dinner" }
];

const seedDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/mess_menu_db');
        console.log('MongoDB Connected for Seeding');

        // Optional: Clear existing items to avoid duplicates or mixed states
        // await FoodItem.deleteMany({});
        // console.log('Cleared existing food items');

        for (const item of foodItems) {
            // Upsert to prevent duplicate key errors if run multiple times
            await FoodItem.findOneAndUpdate(
                { name: item.name },
                item,
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        }

        console.log(`Seeded ${foodItems.length} food items successfully!`);
        process.exit();
    } catch (err) {
        console.error('Seeding Error:', err);
        process.exit(1);
    }
};

seedDB();
