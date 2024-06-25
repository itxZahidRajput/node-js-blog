const { Router } = require('express');
const Blog = require('../models/blog');

const router = Router();

router.get('/', async (req, res) => {
    const allBlogs = await Blog.find({})
    res.render('home', {
        user: req.user,
        blogs: allBlogs
    })
})

router.get('/login', (req, res) => res.render('login'))
router.get('/signup', (req, res) => res.render('signup'))
router.get('/logout', (req, res) => {
    res.clearCookie('token').redirect('/');
})

module.exports = router;