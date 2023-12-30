const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
  email:{ 
    type: String, 
    required: true, 
    unique: true 
  },
  phone:{ 
    type: String, 
    unique: true 
  },
  name:{ 
    type: String,
    required: true 
  },
  profileImage:{ 
    type: String 
  },
  password:{ 
    type: String, 
    required: true 
  },
  role:{ 
    type: String, 
    enum: ['admin', 'user'], 
    default: 'user' 
  }
})

const User = mongoose.model('User', userSchema);
module.exports=User;