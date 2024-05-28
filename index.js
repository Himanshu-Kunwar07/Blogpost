const path  = require('path')
const express = require('express')
const mongoose = require("mongoose")

const userRoute = require('./routes/user')
const blogRoute = require('./routes/blog')
const Blog = require('./models/blog')

const cookieParser = require("cookie-parser")
const {checkforAuthenticationCookie} = require("./middlewares/auth")


const app = express()
const port = 8000

mongoose.connect('mongodb://127.0.0.1:27017/blogpost')
.then((e)=> console.log("MongoDB Connected"));


app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(checkforAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public/images")));

app.set('view engine', "ejs");
app.set('views', path.resolve("./views"));


app.use('/user', userRoute);
app.use('/blog', blogRoute);


app.get('/', async (req, res) =>{

    const allBlogs = await Blog.find({});
    res.render("home",{
        user: req.user,
        blogs: allBlogs,
    });
});

app.listen(port, () => console.log(`Server Started listening on port ${port}!`))