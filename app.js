if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const path = require('path');
const methodOverride = require('method-override')

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/cruds";
const User = require('./model/user');
const { userSchema } = require('./vaildate_schema')

mongoose.connect(dbUrl)
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("Database connected")
})

// require the ejs 
app.engine('ejs', ejsMate);

// dynamic path
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middle_ware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', async (req, res) => {
    const users = await User.find({});
    res.render('user', { users });
})

app.get('/register', async (req, res) => {
    res.render('register');
})

app.post('/register', async (req, res) => {
    const user = new User(req.body.data)
    await user.save();
    res.redirect('/');
})

app.get('/update/:id', async (req, res) => {
    const { id } = req.params;
    const data = await User.findById(id);
    res.render('update', { data })
})

app.patch('/update/:id', async (req, res) => {
    const { username,password, name} = req.body.data;
    const { id } = req.params;
    const result = await User.findAndValidate(id,password);
    if(result){
        const data = await User.findByIdAndUpdate(id, { name,username });
        return res.redirect('/');
    }else{
        res.redirect(`/update/${id}`) 
    }
})

app.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.redirect('/');
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Serving port ${port}`);
})