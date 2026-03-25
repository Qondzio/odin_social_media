const {body} = require("express-validator");
const query=require('../../../prisma/queries.js');

const validateSignUp=[
    body('name').trim()
    .notEmpty().withMessage('Name cannot be empty')
    .bail()
    .matches(/^[A-Za-z]+$/).withMessage('Name must contain only letters'),

    body('lastName').trim()
    .notEmpty().withMessage('Last name cannot be empty')
    .bail()
    .matches(/^[A-Za-z]+$/).withMessage('Last name must contain only letters'),

    body('date').trim()
    .notEmpty().withMessage('Date cannot be empty'),

    body('email').trim()
    .notEmpty().withMessage('Email cannot be empty')
    .bail()
    .isEmail().withMessage('Please enter a valid email')
    .custom(async value=>{
        const user=await query.checkCredentials(value);
        if(user){
            throw new Error('Email already taken')
        }
    }).withMessage('This email is already taken'),

    body('password').trim()
    .notEmpty().withMessage('Password cannot be empty')
    .bail()
    .isLength({min: 5}).withMessage('Password must be at least 5 characters long'),

    body('confirmPassword').trim()
    .notEmpty().withMessage('Please confirm your password')
    .bail()
    .custom((value, { req }) => {
        return value === req.body.password;
    }).withMessage('Confirm password does not match')
]

const validateNewPassword=[
    body('password').trim()
    .notEmpty().withMessage('Password cannot be empty')
    .bail()
    .isLength({min: 5}).withMessage('Password must be at least 5 characters long'),

    body('confirmPassword').trim()
    .notEmpty().withMessage('Please confirm your password')
    .bail()
    .custom((value, { req }) => {
        return value === req.body.password;
    }).withMessage('Confirm password does not match')
]

module.exports={validateSignUp, validateNewPassword}