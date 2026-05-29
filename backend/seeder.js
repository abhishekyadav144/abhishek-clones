import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/productModel.js';
import User from './models/userModel.js';
import products from './data/products.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const importData = async () => {
  try {
    await Product.deleteMany();

    // Fetch the admin user to attach as the creator of these products
    const adminUser = await User.findOne({ isAdmin: true }) || await User.findOne({});
    
    if (!adminUser) {
      console.error('No users found in database. Please register a user first before seeding.');
      process.exit(1);
    }

    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser._id };
    });

    await Product.insertMany(sampleProducts);

    console.log(`Successfully Seeded ${sampleProducts.length} Products!`);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
