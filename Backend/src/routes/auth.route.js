// const express = require('express');

// const router = express.Router();

// const User = require('../models/user.model');

// router.get('/signup', (req, res) => {
//     res.send('Signup endpoint');
// });

// router.get('/login', (req, res) => {
//     res.send('Login endpoint');
// });

// router.get('/logout', (req, res) => {
//     res.send('Logout endpoint');
// });

// module.exports = router;


// const express = require('express');
// const router = express.Router();

// const User = require('../models/user.model');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');


// // ✅ SIGNUP
// router.post('/signup', async (req, res) => {
//     try {
//         const { username, email, password } = req.body;

//         // check if user exists
//         const existingUser = await User.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ message: "User already exists" });
//         }

//         // hash password
//         const hashedPassword = await bcrypt.hash(password, 10);

//         // create user
//         const user = new User({
//             username,
//             email,
//             password: hashedPassword
//         });

//         await user.save();

//         res.status(201).json({ message: "User created successfully" });

//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });


// // ✅ LOGIN
// router.post('/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // find user
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(400).json({ message: "User not found" });
//         }

//         // check password
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//             return res.status(400).json({ message: "Invalid credentials" });
//         }

//         // create token
//         const token = jwt.sign(
//             { userId: user._id },
//             process.env.JWT_SECRET,
//             { expiresIn: "7d" }
//         );

//         res.json({
//             message: "Login successful",
//             token
//         });

//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });


// // ✅ LOGOUT (basic)
// router.get('/logout', (req, res) => {
//     res.json({ message: "Logout successful (client should delete token)" });
// });

// module.exports = router;


const express = require('express');
const router = express.Router();

const User = require('../models/user.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// ✅ SIGNUP
router.post('/signup', async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            fullName,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: user._id,
                username: user.fullName,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// ✅ LOGIN
router.get('/login', (req, res) => {
    res.status(405).json({ message: 'Use POST /api/auth/login with email and password' });
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.fullName,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// ✅ LOGOUT
router.get('/logout', (req, res) => {
    res.json({ message: "Logout successful (delete token on frontend)" });
});


module.exports = router;
