// Script to populate the database with initial data (e.g., admin user, sample books)

// const { connectToDb } = require('../conn');
// const User = require('../src/models/user.model');
// const Book = require('../src/models/book.model');

/*
async function seedDatabase() {
    await connectToDb();
    console.log('Starting database seed...');

    // 1. Create Admin User
    // const admin = await User.create({ ... });

    // 2. Create Sample Books
    // await Book.insertMany([{...}, {...}]);
    
    console.log('Seeding complete.');
    process.exit(0);
}

seedDatabase().catch(err => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
*/

console.log('Run this script via: node scripts/seed.js');

module.exports = {};