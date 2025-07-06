import 'dotenv/config';
import bcrypt from 'bcrypt';

import { connectDatabase } from '../src/config/databse.js';
import { User } from '../src/models/index.js';

const seedData = async () => {
    try {
        await connectDatabase();

        // Clear existing data
        await User.deleteMany({});
        // await Product.deleteMany({});

        // Create admin user
        const hashedPassword = await bcrypt.hash('admin123', 12);
        const adminUser = await User.create({
            name: 'Admin User',
            email: 'admin@example.com',
            password: hashedPassword,
            role: 'admin'
        });

        // Create sample products
        // const products = [
        //     {
        //         name: 'Smartphone',
        //         description: 'Latest model smartphone with advanced features',
        //         price: 699.99,
        //         category: 'Electronics',
        //         createdBy: adminUser._id
        //     },
        //     {
        //         name: 'Laptop',
        //         description: 'High-performance laptop for work and gaming',
        //         price: 1299.99,
        //         category: 'Electronics',
        //         createdBy: adminUser._id
        //     },
        //     {
        //         name: 'Coffee Mug',
        //         description: 'Ceramic coffee mug with company logo',
        //         price: 12.99,
        //         category: 'Accessories',
        //         createdBy: adminUser._id
        //     }
        // ];

        // await Product.insertMany(products);

        console.log('✓ Database seeded successfully!');
        console.log('Admin credentials:');
        console.log('Email: admin@example.com');
        console.log('Password: admin123');

        process.exit(0);
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedData();