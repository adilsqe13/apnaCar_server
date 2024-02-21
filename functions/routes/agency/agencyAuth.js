require('dotenv').config();
const express = require('express');
const router = express.Router();
const Agency = require('../../models.js/agency/AgencyProfile');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
let success = false;


router.post('/register', [
    body('fullName', 'Enter a valid name').isLength({ min: 5 }),
    body('companyName', 'Enter a valid company name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 character').isLength({ min: 5 }),
    body('mobile', 'Mobile number must be atleast 10 character').isLength({ min: 10 }),
    body('companyAddress', 'Enter a valid address').isLength({ min: 5 }),

], async (req, res) => {
    //If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    //Check whether the agency with this email exist already
    try {
        let seller = await Agency.findOne({ email: req.body.email });
        if (seller) {
            return res.status(400).json({ success: false, error: 'Sorry a seller with this email is already exist' });
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        //Create a new agency
        seller = await Agency.create({
            fullName: req.body.fullName,
            companyName: req.body.companyName,
            password: secPass,
            email: req.body.email,
            mobile: req.body.mobile,
            companyAddress: req.body.companyAddress,
        });

        const data = {
            seller: {
                id: seller.id
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({ success: true, authToken: authToken, agencyName: seller.companyName });

    } catch (error) {
        success = false;
        console.log(error.message);
        res.status(500).send(success + "Internal server error");
    }
});


router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password can not be blanck').isLength({ min: 5 })
], async (req, res) => {
    //If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
    }

    try {
        const { email, password } = req.body;
        let seller = await Agency.findOne({ email });
        if (!seller) {
            return res.status(400).json({ success: false, error: 'Please try to login with correct credential' });
        }
        const passwordCompare = await bcrypt.compare(password, seller.password);
        if (!passwordCompare) {
            return res.status(400).json({ success: false, error: 'Please try to login with correct credential' });
        }

        const data = {
            seller: {
                id: seller.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({ success: true, authToken: authToken, agencyName: seller.companyName });

    } catch (error) {
        console.log(error.message);
        res.status(500).send(success + "Internal server error");

    }

});



module.exports = router;