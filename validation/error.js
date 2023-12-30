const { body } = require('express-validator');

const signupValidation = [
    body('email').isEmail(),
    body('phone').optional().isMobilePhone(),
    body('name').notEmpty(),
    body('password').isLength({ min: 6 }),
];

module.exports=signupValidation;