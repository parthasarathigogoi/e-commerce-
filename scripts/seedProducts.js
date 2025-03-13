const mongoose = require('mongoose');
const Product = require('../models/Product');
require('dotenv').config();

const products = [
  {
    name: 'iPhone 15 Pro',
    price: 999.99,
    category: 'Electronics',
    image: '/images/mobile.jpg',
    description: 'Latest iPhone with advanced camera system and A17 Pro chip.',
    rating: 4.8,
    reviews: 245,
    inStock: true
  },
  {
    name: 'Samsung 4K Smart TV',
    price: 799.99,
    category: 'Electronics',
    image: '/images/electronics.jpg',
    description: '55-inch 4K Ultra HD Smart LED TV with HDR.',
    rating: 4.6,
    reviews: 189,
    inStock: true
  },
  {
    name: 'Designer Leather Handbag',
    price: 299.99,
    category: 'Fashion',
    image: '/images/fashions.jpeg',
    description: 'Genuine leather handbag with elegant design.',
    rating: 4.5,
    reviews: 156,
    inStock: true
  },
  {
    name: 'Modern Coffee Table',
    price: 199.99,
    category: 'Home',
    image: '/images/furniture.png',
    description: 'Contemporary design coffee table with storage.',
    rating: 4.4,
    reviews: 98,
    inStock: true
  },
  {
    name: 'Organic Face Cream',
    price: 49.99,
    category: 'Beauty',
    image: '/images/beauty.jpg',
    description: 'Natural and organic face cream for all skin types.',
    rating: 4.7,
    reviews: 324,
    inStock: true
  },
  {
    name: 'Fresh Milk',
    price: 4.99,
    category: 'Groceries',
    image: '/images/milk.png',
    description: 'Fresh farm milk, pasteurized and vitamin D fortified.',
    rating: 4.9,
    reviews: 521,
    inStock: true
  },
  {
    name: 'Organic Honey',
    price: 12.99,
    category: 'Groceries',
    image: '/images/honey.jpeg',
    description: 'Pure organic honey from local beekeepers.',
    rating: 4.8,
    reviews: 245,
    inStock: true
  },
  {
    name: 'Premium Rice',
    price: 24.99,
    category: 'Groceries',
    image: '/images/rice.jpg',
    description: 'Premium quality basmati rice, 5kg pack.',
    rating: 4.6,
    reviews: 178,
    inStock: true
  },
  {
    name: 'Whole Wheat Flour',
    price: 8.99,
    category: 'Groceries',
    image: '/images/flour.jpg',
    description: 'Stone-ground whole wheat flour, 2kg pack.',
    rating: 4.5,
    reviews: 156,
    inStock: true
  },
  {
    name: 'Sea Salt',
    price: 6.99,
    category: 'Groceries',
    image: '/images/salt.jpg',
    description: 'Natural sea salt, rich in minerals.',
    rating: 4.7,
    reviews: 203,
    inStock: true
  }
];

const seedProducts = async () => {
  try {
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/e-commerce';
    
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    await Product.insertMany(products);
    console.log('Added sample products');

    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding products:', error);
    process.exit(1);
  }
};

seedProducts(); 