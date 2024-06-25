require('dotenv').config()

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const staticRoutes = require('./routes/staticRoutes');
const userRoutes = require('./routes/user');
const blogRoutes = require('./routes/blog');

const { checkForAuthenticationCookie } = require('./middlewares/auth');

const app = express();
const port = process.env.PORT;

mongoose.connect(process.env.MONGODB_URL)
    .then(console.log('Connected to database'))

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'));

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(checkForAuthenticationCookie('token'))
app.use(express.static(path.resolve('./public')))

app.use('/', staticRoutes)
app.use('/user', userRoutes)
app.use('/blog', blogRoutes)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})