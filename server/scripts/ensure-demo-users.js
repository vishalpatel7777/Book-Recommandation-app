const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
async function run(){
  await mongoose.connect(process.env.DB_URI);
  const User = require('../src/models/user.model');
  async function make(u){
    let ex = await User.findOne({ email: u.email });
    if(ex){
      ex.username = u.username;
      ex.role = u.role;
      ex.fullname = u.fullname;
      ex.phone = u.phone;
      ex.age = u.age;
      ex.genre = u.genre;
      ex.isVerified = true;
      ex.verificationToken = null;
      ex.password = u.password; // pre-save hook will hash
      await ex.save();
      console.log('updated', u.email);
    } else {
      const nu = new User({ ...u, isVerified:true, verificationToken:null });
      await nu.save();
      console.log('created', u.email);
    }
  }
  const demoAuthorEmail = process.env.DEMO_AUTHOR_EMAIL || 'author@example.com';
  const demoAuthorPass = process.env.DEMO_AUTHOR_PASSWORD || process.env.DEMO_PASSWORD || 'ChangeMe123!';
  const demoUserEmail = process.env.DEMO_USER_EMAIL || 'user@example.com';
  const demoUserPass = process.env.DEMO_USER_PASSWORD || process.env.DEMO_PASSWORD || 'ChangeMe123!';
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;
  const adminPass = process.env.ADMIN_PASSWORD || process.env.DEMO_ADMIN_PASSWORD || 'ChangeMe123!';
  if (!adminEmail) throw new Error('ADMIN_EMAIL or EMAIL_USER must be set in .env for seeding demo admin');
  await make({ username:'testauthor', email: demoAuthorEmail, password: demoAuthorPass, fullname:'Test Author', phone:'9876543210', age:30, genre:'Fiction', role:'author' });
  await make({ username:'testuser', email: demoUserEmail, password: demoUserPass, fullname:'Test User', phone:'9876543211', age:25, genre:'Fiction', role:'user' });
  let admin = await User.findOne({ email: adminEmail });
  if(admin){
    admin.password=adminPass;
    admin.isVerified=true;
    admin.verificationToken=null;
    await admin.save();
    console.log('admin reset (password from env)');
  } else {
    const ad=new User({ username:'Admin', email: adminEmail, password: adminPass, fullname:'Admin User', phone:'9876543212', age:30, genre:'Fiction', role:'admin', isVerified:true, verificationToken:null });
    await ad.save();
    console.log('admin created (password from env)');
  }
  const us=await User.find({ email: { $in:[demoAuthorEmail, demoUserEmail, adminEmail] } }).select('username email role isVerified').lean();
  console.log(JSON.stringify(us,null,2));
  await mongoose.disconnect();
} 
run().catch(e=>{console.error(e);process.exit(1)});
