const express=require('express');
const router=express.Router();
const authenticate=require('../middleware/authenticate')
const upload=require('../fileupload/fileUpload');
const signUpvalidation=require('../validation/error')

const {signupUser,loginUser,updateUser,deleteUser}=require('../Controller/user');

router.post('/signUp',upload.single('profileImage'),signUpvalidation,signupUser);
router.post('/login',loginUser);
router.post('/:id',authenticate,upload.single('profileImage'),updateUser)
router.delete('/:id',authenticate,deleteUser);

module.exports=router;