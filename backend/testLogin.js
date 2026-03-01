import mongoose from 'mongoose';
import dotenv from 'dotenv';
import ShopAdmin from './models/ShopAdmin.js';

dotenv.config();

const testLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected\n');

    // Test all shop admins
    const emails = [
      'admin@pizzaparadise.com',
      'admin@burgerheaven.com',
      'admin@sushidelight.com'
    ];

    for (const email of emails) {
      console.log(`\nTesting: ${email}`);
      const shopAdmin = await ShopAdmin.findOne({ email });
      
      if (!shopAdmin) {
        console.log('❌ Shop admin not found');
        continue;
      }

      console.log('✓ Shop admin found');
      console.log('  Name:', shopAdmin.name);
      console.log('  Active:', shopAdmin.isActive);
      console.log('  Shop ID:', shopAdmin.shopId);
      
      const isMatch = await shopAdmin.matchPassword('shop123');
      console.log('  Password match:', isMatch ? '✅ YES' : '❌ NO');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

testLogin();
