const { Router } = require('express');
const User = require('../models/user');

const router = Router();

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const token = await User.matchPasswordAndGenerateToken(email, password)

        return res.cookie('token', token).redirect('/');
    } catch (error) {
        return res.render('login', {
            error
        });
    }
});

router.post('/signup', async (req, res) => {
    const { fullName, email, password } = req.body;
    await User.create({ fullName, email, password });
    return res.redirect('/login');
});


module.exports = router;