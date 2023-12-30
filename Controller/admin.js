const User=require('../Models/userModel');
const bcrypt=require('bcrypt');

const {validationResult}=require('express-validator');

const getUser=async(req,res)=>{
    try {
        // Only allow access to admins
        console.log(req.user.role);
        if (req.user.role !== 'admin') {
          return res.status(403).json({ message: 'Forbidden' });
        }
        
        const users=await User.find();
        res.status(200).json(users);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
}


const adminCreation=async(req,res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { email, phone, name, password } = req.body;
    if (!email && !phone) {
      return res.status(400).json({ message: 'Email or phone is required' });
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newAdmin = new User({
      email,
      phone,
      name,
      password: hashedPassword,
      role: 'admin',
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


const getSingleUser=async(req,res)=>{
  try {
    // Only allow access to admins
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const userId = req.params.id;

    const user=await User.findById(userId);
    if(!user){
      return res.status(400).json({"message":"User not Found"});
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


const updateUser=async(req,res)=>{
  try {
    // Only allow access to admins
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const userId = req.params.id;
    const { name, profileImage } = req.body;

    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    existingUser.name = name || existingUser.name;
    existingUser.profileImage = req.file ? req.file.filename : existingUser.profileImage;

    const updatedUser = await existingUser.save();
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


const deleteUser=async(req,res)=>{
  try {
    // Only allow access to admins
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const userId = req.params.id;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}


module.exports={getUser,adminCreation,getSingleUser,updateUser,deleteUser};