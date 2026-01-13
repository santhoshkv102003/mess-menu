const mongoose = require('mongoose');
const FoodItem = require('./models/FoodItem');

const userListRaw = `
Idli with Sambar
Plain Dosa
Masala Dosa
Pongal
Poori with Potato Masala
Upma
Rava Dosa
Appam with Coconut Milk
Puttu with Kadala Curry
Egg Omelette
Veg Meals (Rice, Sambar, Poriyal, Appalam)
Sambar Rice
Rasam Rice
Curd Rice
Lemon Rice
Vegetable Biryani
Kootu with Rice
Chicken Curry with Rice
Chicken Biryani
Chicken Fry
Fish Curry with Rice
Fish Fry
Bajji
Bonda
Samosa
Sundal (Channa / Peanut)
Vada
Mixture
Bread Omelette
Egg Puff
Chapati with Veg Kurma
Parotta with Veg Salna
Idiyappam with Kurma
Lemon Sevai
Vegetable Fried Rice
Dosa with Chutney
Parotta with Chicken Salna
Chapati with Chicken Gravy
Chicken Fried Rice
Fish Gravy with Rice
`;

// Extract clean names (ignoring headers if I pasted them, but I manually cleaned above list based on user prompt headers)
const targetNames = userListRaw.split('\n').map(l => l.trim()).filter(l => l.length > 0);

const verify = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/mess_menu_db');
        console.log('Connected to DB');

        const dbItems = await FoodItem.find({});
        const dbMap = new Map(dbItems.map(i => [i.name.toLowerCase(), i]));

        let missingItems = [];
        let missingImages = [];

        for (const target of targetNames) {
            // Fuzzy match or direct? User list seems exact to seed.js
            const item = dbMap.get(target.toLowerCase());
            if (!item) {
                missingItems.push(target);
            } else if (!item.image || item.image.trim() === '') {
                missingImages.push(target);
            }
        }

        console.log('--- Verification Report ---');
        console.log(`Total Target Items: ${targetNames.length}`);
        console.log(`Missing from DB: ${missingItems.length}`);
        if (missingItems.length > 0) console.log(missingItems);
        console.log(`Missing Images: ${missingImages.length}`);
        if (missingImages.length > 0) console.log(missingImages);
        console.log('---------------------------');

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verify();
