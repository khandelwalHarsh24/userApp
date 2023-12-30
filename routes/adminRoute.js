const express=require('express');
const router=express.Router();
const authenticate=require('../middleware/authenticate');
const upload=require('../fileupload/fileUpload');

const {getUser,adminCreation,updateUser,getSingleUser,deleteUser} =require('../Controller/admin');
const signUpvalidation=require('../validation/error');

router.post('/signup',authenticate,signUpvalidation,adminCreation)
router.get('/users',authenticate,getUser);
router.post('/user/:id',authenticate,upload.single('profileImage'),updateUser).get('/user/:id',authenticate,getSingleUser).delete('/user/:id',authenticate,deleteUser)

module.exports=router;

