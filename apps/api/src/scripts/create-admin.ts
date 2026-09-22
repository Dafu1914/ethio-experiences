import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { env } from '../config/env';
import { User } from '../models/User';

const name = 'Fuad Kedir';
const email = 'fuadkedir1914@gmail.com';
const password = '12345678';

async function run() {
  await mongoose.connect(env.MONGO_URI);

  let user = await User.findOne({ email });
  if (user) {
    user.name = name;
    user.role = 'admin';
    user.emailVerified = true;
    user.passwordHash = await bcrypt.hash(password, 12);
    await user.save();
    console.log(`✅ Updated existing user → ${email} is now an ADMIN`);
  } else {
    await User.create({
      name,
      email,
      passwordHash: await bcrypt.hash(password, 12),
      role: 'admin',
      emailVerified: true,
    });
    console.log(`✅ Created admin: ${email}`);
  }

  console.log(`   Name:     ${name}`);
  console.log(`   Email:    ${email}`);
  console.log(`   Password: ${password}`);
  console.log(`   Role:     admin`);

  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});