const { Router } = require('express');
const multer = require('multer')
const path = require('path')
const Blog = require('../models/blog');
const Comment = require('../models/comment');

router = Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve(`./public/uploads/`))
    },
    filename: (req, file, cb) => {
        const fileName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.]+/g, '-').toLowerCase()}`
        cb(null, fileName)
    }
})

const upload = multer({ storage: storage })

router.get('/add-new', (req, res) => res.render('addBlog', {
    user: req.user
}))

router.post('/', upload.single('coverImage'), async (req, res) => {
    const { title, body } = req.body
    const coverImage = req.file.filename
    const blog = await Blog.create({
        title,
        body,
        coverImageURL: `/uploads/${req.file.filename}`,
        createdBy: req.user._id
    })
    console.log(blog)
    return res.redirect(`/blog/${blog._id}`)
})

router.get('/:id', async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate('createdBy')
    const comments = await Comment.find({ blogId: req.params.id }).populate('createdBy')
    return res.render('blog', {
        user: req.user,
        blog,
        comments
    })
})

router.post('/comment/:blogId', async (req, res) => {
    await Comment.create({
        content: req.body.content,
        blogId: req.params.blogId,
        createdBy: req.user._id
    })
    return res.redirect(`/blog/${req.params.blogId}`)
})

module.exports = router;