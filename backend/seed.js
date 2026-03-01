import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';
import Shop from './models/Shop.js';
import ShopAdmin from './models/ShopAdmin.js';
import Product from './models/Product.js';
import Order from './models/Order.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Admin.deleteMany({});
    await Shop.deleteMany({});
    await ShopAdmin.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create Master Admin
    console.log('👤 Creating Master Admin...');
    const masterAdmin = await Admin.create({
      name: 'Master Admin',
      email: 'admin@qrmenu.com',
      password: 'admin123',
    });
    console.log('✅ Master Admin created:', masterAdmin.email);

    // Create Shops
    console.log('🏪 Creating Shops...');
    const shop1 = await Shop.create({
      name: 'Pizza Paradise',
      ownerName: 'John Doe',
      phone: '555-0100',
      email: 'contact@pizzaparadise.com',
      address: '123 Main Street, Downtown',
      status: 'active',
      qrUrl: 'pizza-paradise-' + Date.now(),
      createdBy: masterAdmin._id,
    });

    const shop2 = await Shop.create({
      name: 'Burger Heaven',
      ownerName: 'Jane Smith',
      phone: '555-0200',
      email: 'info@burgerheaven.com',
      address: '456 Oak Avenue, Uptown',
      status: 'active',
      qrUrl: 'burger-heaven-' + Date.now(),
      createdBy: masterAdmin._id,
    });

    const shop3 = await Shop.create({
      name: 'Sushi Delight',
      ownerName: 'Mike Johnson',
      phone: '555-0300',
      email: 'hello@sushidelight.com',
      address: '789 Pine Road, Midtown',
      status: 'active',
      qrUrl: 'sushi-delight-' + Date.now(),
      createdBy: masterAdmin._id,
    });

    console.log('✅ Created 3 shops');

    // Create Shop Admins
    console.log('👥 Creating Shop Admins...');

    const shopAdmin1 = await ShopAdmin.create({
      name: 'Pizza Admin',
      email: 'admin@pizzaparadise.com',
      phone: '555-0101',
      password: 'shop123',
      shopId: shop1._id,
      isActive: true,
    });

    const shopAdmin2 = await ShopAdmin.create({
      name: 'Burger Admin',
      email: 'admin@burgerheaven.com',
      phone: '555-0201',
      password: 'shop123',
      shopId: shop2._id,
      isActive: true,
    });

    const shopAdmin3 = await ShopAdmin.create({
      name: 'Sushi Admin',
      email: 'admin@sushidelight.com',
      phone: '555-0301',
      password: 'shop123',
      shopId: shop3._id,
      isActive: true,
    });

    console.log('✅ Created 3 shop admins');

    // Create Products for Pizza Paradise
    console.log('🍕 Creating Products for Pizza Paradise...');
    await Product.insertMany([
      {
        name: 'Margherita Pizza',
        price: 12.99,
        category: 'main',
        description: 'Classic tomato, mozzarella, and basil',
        isVeg: true,
        isAvailable: true,
        shopId: shop1._id,
        createdBy: shopAdmin1._id,
      },
      {
        name: 'Pepperoni Pizza',
        price: 14.99,
        category: 'main',
        description: 'Pepperoni, cheese, and tomato sauce',
        isVeg: false,
        isAvailable: true,
        shopId: shop1._id,
        createdBy: shopAdmin1._id,
      },
      {
        name: 'Vegetarian Supreme',
        price: 13.99,
        category: 'main',
        description: 'Bell peppers, mushrooms, olives, onions',
        isVeg: true,
        isAvailable: true,
        shopId: shop1._id,
        createdBy: shopAdmin1._id,
      },
      {
        name: 'Garlic Bread',
        price: 5.99,
        category: 'starter',
        description: 'Toasted bread with garlic butter',
        isVeg: true,
        isAvailable: true,
        shopId: shop1._id,
        createdBy: shopAdmin1._id,
      },
      {
        name: 'Caesar Salad',
        price: 8.99,
        category: 'starter',
        description: 'Fresh romaine, parmesan, croutons',
        isVeg: true,
        isAvailable: true,
        shopId: shop1._id,
        createdBy: shopAdmin1._id,
      },
      {
        name: 'Tiramisu',
        price: 6.99,
        category: 'dessert',
        description: 'Classic Italian dessert',
        isVeg: true,
        isAvailable: true,
        shopId: shop1._id,
        createdBy: shopAdmin1._id,
      },
      {
        name: 'Coca Cola',
        price: 2.99,
        category: 'drink',
        description: 'Chilled soft drink',
        isVeg: true,
        isAvailable: true,
        shopId: shop1._id,
        createdBy: shopAdmin1._id,
      },
    ]);

    // Create Products for Burger Heaven
    console.log('🍔 Creating Products for Burger Heaven...');
    await Product.insertMany([
      {
        name: 'Classic Burger',
        price: 9.99,
        category: 'main',
        description: 'Beef patty, lettuce, tomato, cheese',
        isVeg: false,
        isAvailable: true,
        shopId: shop2._id,
        createdBy: shopAdmin2._id,
      },
      {
        name: 'Veggie Burger',
        price: 8.99,
        category: 'main',
        description: 'Plant-based patty with fresh veggies',
        isVeg: true,
        isAvailable: true,
        shopId: shop2._id,
        createdBy: shopAdmin2._id,
      },
      {
        name: 'Chicken Burger',
        price: 10.99,
        category: 'main',
        description: 'Grilled chicken with special sauce',
        isVeg: false,
        isAvailable: true,
        shopId: shop2._id,
        createdBy: shopAdmin2._id,
      },
      {
        name: 'French Fries',
        price: 4.99,
        category: 'snack',
        description: 'Crispy golden fries',
        isVeg: true,
        isAvailable: true,
        shopId: shop2._id,
        createdBy: shopAdmin2._id,
      },
      {
        name: 'Onion Rings',
        price: 5.99,
        category: 'snack',
        description: 'Crispy battered onion rings',
        isVeg: true,
        isAvailable: true,
        shopId: shop2._id,
        createdBy: shopAdmin2._id,
      },
      {
        name: 'Milkshake',
        price: 4.99,
        category: 'drink',
        description: 'Chocolate, vanilla, or strawberry',
        isVeg: true,
        isAvailable: true,
        shopId: shop2._id,
        createdBy: shopAdmin2._id,
      },
      {
        name: 'Ice Cream Sundae',
        price: 5.99,
        category: 'dessert',
        description: 'Vanilla ice cream with toppings',
        isVeg: true,
        isAvailable: true,
        shopId: shop2._id,
        createdBy: shopAdmin2._id,
      },
    ]);

    // Create Products for Sushi Delight
    console.log('🍣 Creating Products for Sushi Delight...');
    await Product.insertMany([
      {
        name: 'California Roll',
        price: 11.99,
        category: 'main',
        description: 'Crab, avocado, cucumber',
        isVeg: false,
        isAvailable: true,
        shopId: shop3._id,
        createdBy: shopAdmin3._id,
      },
      {
        name: 'Vegetable Sushi',
        price: 9.99,
        category: 'main',
        description: 'Assorted fresh vegetables',
        isVeg: true,
        isAvailable: true,
        shopId: shop3._id,
        createdBy: shopAdmin3._id,
      },
      {
        name: 'Salmon Sashimi',
        price: 15.99,
        category: 'main',
        description: 'Fresh salmon slices',
        isVeg: false,
        isAvailable: true,
        shopId: shop3._id,
        createdBy: shopAdmin3._id,
      },
      {
        name: 'Miso Soup',
        price: 3.99,
        category: 'starter',
        description: 'Traditional Japanese soup',
        isVeg: true,
        isAvailable: true,
        shopId: shop3._id,
        createdBy: shopAdmin3._id,
      },
      {
        name: 'Edamame',
        price: 4.99,
        category: 'starter',
        description: 'Steamed soybeans with salt',
        isVeg: true,
        isAvailable: true,
        shopId: shop3._id,
        createdBy: shopAdmin3._id,
      },
      {
        name: 'Green Tea',
        price: 2.99,
        category: 'drink',
        description: 'Hot or iced green tea',
        isVeg: true,
        isAvailable: true,
        shopId: shop3._id,
        createdBy: shopAdmin3._id,
      },
      {
        name: 'Mochi Ice Cream',
        price: 6.99,
        category: 'dessert',
        description: 'Rice cake with ice cream filling',
        isVeg: true,
        isAvailable: true,
        shopId: shop3._id,
        createdBy: shopAdmin3._id,
      },
    ]);

    console.log('✅ Created products for all shops');

    console.log('\n🎉 Seed Data Successfully Created!\n');
    console.log('📋 Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n🔐 Master Admin:');
    console.log('   Email: admin@qrmenu.com');
    console.log('   Password: admin123');
    console.log('\n🏪 Shop Admins:');
    console.log('   1. Pizza Paradise');
    console.log('      Email: admin@pizzaparadise.com');
    console.log('      Password: shop123');
    console.log(`      Shop ID: ${shop1._id}`);
    console.log('\n   2. Burger Heaven');
    console.log('      Email: admin@burgerheaven.com');
    console.log('      Password: shop123');
    console.log(`      Shop ID: ${shop2._id}`);
    console.log('\n   3. Sushi Delight');
    console.log('      Email: admin@sushidelight.com');
    console.log('      Password: shop123');
    console.log(`      Shop ID: ${shop3._id}`);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
