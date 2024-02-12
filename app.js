require('dotenv').config();
const express = require('express');
const hbs = require('express-handlebars');
const {auth} = require('express-openid-connect')
const db = require("./connection/connection")
const projectRoutes = require('./routes/projectRoute')
const homeRoutes = require('./routes/homeRoute');
const taskRoutes = require('./routes/taskRoute')

const app = express()
const PORT = process.env.PORT || 4000;

const {
    AUTH0_SECRET, 
    AUTH0_CLIENT_ID, 
    AUTH0_BASE_URL
    } = process.env;

const config = {
    authRequired: true, 
    auth0Logout: true,
    secret: AUTH0_SECRET, 
    baseURL: `http://localhost:${PORT}`, 
    clientID: AUTH0_CLIENT_ID, 
    issuerBaseURL: AUTH0_BASE_URL
};

app.engine('handlebars', hbs.engine());
app.set('view engine', 'handlebars');

app.use(express.json())
app.use(express.urlencoded({extended:true}));


app.get('/', (req, res) => {
    res.render('home')
})

app.use(auth(config));



app.use('/projects', projectRoutes);
app.use('/dashboard', homeRoutes);
app.use('/projects', taskRoutes)



db.once('open', () => {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`)
    }) 
})
