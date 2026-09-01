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
  await make({ username:'testauthor', email:'author@test.com', password:'Author@123', fullname:'Test Author', phone:'9876543210', age:30, genre:'Fiction', role:'author' });
  await make({ username:'testuser', email:'user@test.com', password:'User@1234', fullname:'Test User', phone:'9876543211', age:25, genre:'Fiction', role:'user' });
  let admin = await User.findOne({ email:'kuzemasachika636@gmail.com' });
  if(admin){
    admin.password='Admin@123';
    admin.isVerified=true;
    admin.verificationToken=null;
    await admin.save();
    console.log('admin reset Admin@123');
  } else {
    const ad=new User({ username:'Admin', email:'kuzemasachika636@gmail.com', password:'Admin@123', fullname:'Admin User', phone:'9876543212', age:30, genre:'Fiction', role:'admin', isVerified:true, verificationToken:null });
    await ad.save();
    console.log('admin created Admin@123');
  }
  const us=await User.find({ email: { $in:['author@test.com','user@test.com','kuzemasachika636@gmail.com'] } }).select('username email role isVerified').lean();
  console.log(JSON.stringify(us,null,2));
  await mongoose.disconnect();
}
run().catch(e=>{console.error(e);process.exit(1)});
