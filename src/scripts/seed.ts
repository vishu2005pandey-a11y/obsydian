import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dbConnect from '../lib/db';
import { User } from '../models/User';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
// Also try to load from .env.example if MONGODB_URI is not set
if (!process.env.MONGODB_URI) {
  dotenv.config({ path: '.env.example' });
}

async function seed() {
  try {
    await dbConnect();
    console.log('Connected to database...');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log('Cleared existing data...');

    // Create Admin User
    const hashedAdminPassword = await bcrypt.hash('admin123', 10);
    const adminUser = new User({
      name: 'Admin Obsydian',
      email: 'admin@obsydian.com',
      password: hashedAdminPassword,
      role: 'admin',
    });
    await adminUser.save();
    console.log('Admin user created (admin@obsydian.com / admin123)');

    // Create Categories
    const categories = await Category.insertMany([
      { name: 'Anime Tees', slug: 'anime-tees', image: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?q=80&w=800' },
      { name: 'Oversized Hoodies', slug: 'oversized-hoodies', image: 'https://images.unsplash.com/photo-1620799140188-3b2a02fd9a77?q=80&w=800' },
      { name: 'Superhero Classics', slug: 'superhero-classics', image: 'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?q=80&w=800' }
    ]);
    console.log('Categories created...');

    // Create Products
    const products = [
      {
        name: 'Gojo Limitless Oversized Tee',
        slug: 'gojo-limitless-oversized-tee',
        description: 'Premium heavyweight cotton tee featuring a minimalist high-density print of Gojo Satoru. Glow-in-the-dark neon accents.',
        price: 39.99,
        images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800'],
        category: categories[0]._id,
        sizes: ['M', 'L', 'XL', 'XXL'],
        colors: ['Matte Black', 'White'],
        stock: 120,
        ratings: 5,
        isFeatured: true,
      },
      {
        name: 'Akatsuki Cloud Stealth Hoodie',
        slug: 'akatsuki-cloud-stealth-hoodie',
        description: 'Dark stealth streetwear hoodie with subtle embroidered red clouds. Made from 400gsm premium fleece.',
        price: 89.99,
        images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800'],
        category: categories[1]._id,
        sizes: ['M', 'L', 'XL'],
        colors: ['Black'],
        stock: 50,
        ratings: 4,
        isFeatured: true,
      },
      {
        name: 'Miles Morales Web Slinger Tee',
        slug: 'miles-morales-web-slinger-tee',
        description: 'Into the Spider-Verse inspired design. High-quality puff print on premium black cotton.',
        price: 45.00,
        images: ['https://images.unsplash.com/photo-1634828221818-503587f19d4d?q=80&w=800'],
        category: categories[2]._id,
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black/Red'],
        stock: 85,
        ratings: 5,
        isFeatured: true,
      },
      {
        name: 'Gotham Knight Oversized Hoodie',
        slug: 'gotham-knight-oversized-hoodie',
        description: 'Thick, tactical feel hoodie with a stealth matte black Batman logo embossed on the chest.',
        price: 95.00,
        images: ['https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?q=80&w=800'],
        category: categories[2]._id,
        sizes: ['L', 'XL', 'XXL'],
        colors: ['Stealth Black'],
        stock: 30,
        ratings: 5,
        isFeatured: true,
      }
    ];

    await Product.insertMany(products);
    console.log('Products created...');

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seed();
