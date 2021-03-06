const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

const {isAuthenticated} = require("../middleware/jwt.middleware");
const User = require("../models/User.model");
const { token } = require("morgan");

const router = express.Router();
const saltRounds = 10;

// Create Account
router.post('/signup', (req, res, next) => {
    const { email, password, firstName, lastName, specialty } = req.body;

    // Check if email or password or name are provided as empty string 
    if (email === '' || password === '') {
        res.status(400).json({ message: "Provide email, password and name" });
        return;
    }

    // Use regex to validate the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
        res.status(400).json({ message: 'Provide a valid email address.' });
        return;
    }

    // Use regex to validate the password format
    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
        res.status(400).json({ message: 'Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.' });
        return;
    }


    // Check the users collection if a user with the same email already exists
    User.findOne({ email })
        .then((foundUser) => {
            // If the user with the same email already exists, send an error response
            if (foundUser) {
                const userError = new Error();
                userError.name = 'emailError';
                throw userError;
            }

            // If email is unique, proceed to hash the password
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashedPassword = bcrypt.hashSync(password, salt);

            // Create the new user in the database
            // We return a pending promise, which allows us to chain another `then` 
            return User.create({ email, password: hashedPassword , firstName, lastName, specialty });
        })
        .then((createdUser) => {
            // Deconstruct the newly created user object to omit the password
            // We should never expose passwords publicly
            const { email, _id } = createdUser;

            // Create a new object that doesn't expose the password
            const user = { email, _id };
            const payload = { _id: createdUser._id };
            // Send a json response containing the user object
            res.status(201).json({ user: user });
        })
        .catch(err => {
            if (err.name === 'emailError') {
                res.status(401).json({message: ' email is already taken'})
            } else {
                res.status(500).json({ message: "Internal Server Error: error creating new user" })
            }
           
            
        });
});

// Get user info 

router.get('/login', isAuthenticated, (req,res,next) => {
    console.log(token)
    User.findById(req.payload._id)
    .then( response => {
        User.find()
            .then(allDocs => res.json({response, allDocs}))
    })
    .catch( err => res.status(400).json("error in route to get info from doctor", err))
})

// Login
router.post('/login', (req, res, next) => {
    const { email, password } = req.body;

    // Check if email or password are provided as empty string 
    if (email === '' || password === '') {
        res.status(400).json({ message: "Provide email and password." });
        return;
    }

    // Check the users collection if a user with the same email exists
    User.findOne({ email })
        .then((foundUser) => {

            if (!foundUser) {
                // If the user is not found, send an error response
                res.status(401).json({ message: "User not found." })
                return;
            }

            // Compare the provided password with the one saved in the database
            const passwordCorrect = bcrypt.compareSync(password, foundUser.password);

            if (passwordCorrect) { // login was successful

                // Deconstruct the user object to omit the password
                const { _id, email} = foundUser;

                // Create an object that will be set as the token payload
                const payload = { _id, email };

                // Create and sign the token
                const authToken = jwt.sign(
                    payload,
                    process.env.TOKEN_SECRET,
                    { algorithm: 'HS256', expiresIn: "6h" }
                );

                // Send the token as the response
                console.log(authToken);
                res.json({ authToken: authToken , foundUser : foundUser});
            }
            else {
                res.status(401).json({ message: "Unable to authenticate the user" });
            }

        })
        .catch(err => res.status(500).json({ message: "Internal Server Error" }));
});


// Verify
router.get('/verify', isAuthenticated, (req, res, next) => {
 
    // If JWT token is valid the payload gets decoded by the
    // isAuthenticated middleware and made available on `req.payload`
    console.log("token is valid", req.payload);
    console.log("req.payload...", req.payload);
    
    // Send back the object with user data
    // previously set as the token payload
    res.status(200).json(req.payload);
  });

module.exports = router;

