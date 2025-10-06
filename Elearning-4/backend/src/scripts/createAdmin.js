import { User } from '../models/index.js';
import { hashPassword } from '../utils/helpers.js';
import dotenv from 'dotenv';

dotenv.config();

const createAdminUser = async () => {
  try {
    const adminExists = await User.findOne({ where: { email: 'admin@blog.com' } });
    
    if (adminExists) {
      console.log('✅ Admin user already exists');
      return;
    }

    const hashedPassword = await hashPassword('Admin123!');
    
    const admin = await User.create({
      username: 'admin',
      email: 'admin@blog.com',
      password: hashedPassword,
      full_name: 'System Administrator',
      role: 'admin'
    });

    console.log('✅ Admin user created successfully:');
    console.log(`   Email: admin@blog.com`);
    console.log(`   Password: Admin123!`);
    console.log(`   Username: admin`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to create admin user:', error);
    process.exit(1);
  }
};

createAdminUser();