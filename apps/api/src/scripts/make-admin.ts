import mongoose from 'mongoose';
import { env } from '../config/env';
import { User } from '../models/User';

const email = process.argv[2];

async function run() {
  if (!email) {
    console.error('Usage: tsx src/scripts/make-admin.ts <email>');
    process.exit(1);
  }

  await mongoose.connect(env.MONGO_URI);
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    console.error(`❌ No user with email ${email}`);
    await mongoose.disconnect();
    process.exit(1);
  }

  user.role = 'admin';
  await user.save();
  console.log(`✅ ${user.email} is now an admin`);
  await mongoose.disconnect();
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});