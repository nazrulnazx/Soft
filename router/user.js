const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { check, validationResult } = require('express-validator');
const config = require('config');//jwtSecret
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const auth   = require('../middleware/auth');



/**
 *  URL      user/create
 *  Method   post
 *  ACCESS   public
 */
router.post('/create', [
    check('firstname', 'First Name is Required').not().isEmpty(),
    check('lastname', 'Last Name is Required').not().isEmpty(),
    check('email', 'Email is Required').isEmail(),
    check('password', 'Password should be minimum 6 char').isLength({ min: "6" })
], async (req, res) => {

    try {

        // Validation Check
        var errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(401).json({ status: "0", msg: "Server Error", error: errors.array() });
        }

        // Validation Check
        var { firstname, lastname, email, password } = req.body;

        const user = User.build({
            firstname,
            lastname,
            email,
            password
        });

        let salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);


        user.password = password;

        await user.save();

        if (!user.id) {
            res.status(500).json({ status: "0", msg: "Server Error" });
        }

        jwt.sign({
            user: {
                id: user.id
            }
        }, require('config').get('jwtSecret'), { expiresIn: 60 * 60 * 60 }, (err, token) => {
            
            if (err) throw err;
            return res.status(200).json({ status: "1", msg: "User created sucessfully", token });

        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ status: "0", msg: "Server Error" });
    }
});



/**
 *  URL      user/all
 *  Method   post
 *  ACCESS   public
 */
router.get('/all',[auth], async (req, res) => {

    try {
        const users = await User.findAll();
        return res.status(200).json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ status: "0", msg: "Server Error" });
    }

});



/**
 *  URL      user/get/{id}
 *  Method   post
 *  ACCESS   public
 */
router.get('/get/:id', async (req, res) => {

    try {
        const user = await User.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!user) {
            return res.status(402).json({ status: "0", msg: "User Not Found !" });
        }

        return res.status(200).json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ status: "0", msg: "Server Error" });
    }

});


module.exports = router;