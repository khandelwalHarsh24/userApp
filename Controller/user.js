const User = require("../Models/userModel");
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const {validationResult}=require('express-validator');

const signupUser=async(req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, phone, name, password } = req.body;
        if (!email && !phone) {
          return res.status(400).json({ message: 'Email or phone is required' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(req.file);
        const newUser = new User({
          email,
          phone,
          name,
          password: hashedPassword,
          profileImage: req.file?req.file.filename: undefined
        });
        // console.log(newUser);
    
        await newUser.save();
        res.status(201).json({ message: 'User created successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
}


const loginUser=async(req,res)=>{
    try {
        const { email, phone, password } = req.body;
        const secret=process.env.secret;
        if (!email && !phone) {
          return res.status(400).json({ message: 'Email or phone is required' });
        }
    
        const user = await User.findOne({ $or: [{ email }, { phone }] });
    
        if (!user || !(await bcrypt.compare(password, user.password))) {
          return res.status(401).json({ message: 'User Does not Exist or Invalid credentials' });
        }
    
        const token = jwt.sign({ userId: user._id, role: user.role }, secret, { expiresIn: '1h' });
    
        res.json({ userDetails: user, token });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
}


const updateUser=async(req,res)=>{
    try {
        const { name } = req.body;
        const userId = req.params.id;
    
        // Users can only modify their own name and profile image
        if (req.user.userId !== userId) {
          return res.status(403).json({ message: 'Forbidden' });
        }
    
        // Find the user by ID
        const existingUser = await User.findById(userId);
    
        if (!existingUser) {
          return res.status(404).json({ message: 'User not found' });
        }

        // Update only the provided fields
        existingUser.name = name || existingUser.name;
        existingUser.profileImage = req.file ? req.file.filename : existingUser.profileImage;
    
        // Save the updated user
        const updatedUser = await existingUser.save();
    
        res.json(updatedUser);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
      }
}



const deleteUser=async(req,res)=>{
  try {
    const userId = req.params.id;

    // Users can only delete their own accounts
    if (req.user.userId !== userId) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    await User.findByIdAndDelete(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

module.exports={signupUser,loginUser,updateUser,deleteUser};