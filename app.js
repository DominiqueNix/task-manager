require('dotenv').config();
const express = require('express');
const hbs = require('express-handlebars');
const {auth} = require('express-openid-connect')

const allTaskRoute = require('./routes/allTaskRoute')
const projectRoutes = require('./routes/projectRoute')
const homeRoutes = require('./routes/homeRoute');
const taskRoutes = require('./routes/taskRoute')
const helpers = require('./utils/helpers')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 4000;

const {
    AUTH0_SECRET, 
    AUTH0_CLIENT_ID, 
    AUTH0_BASE_URL, 
    BASE_URL
    } = process.env;

const config = {
    authRequired: true, 
    auth0Logout: true,
    secret: AUTH0_SECRET, 
    baseURL: BASE_URL, 
    clientID: AUTH0_CLIENT_ID, 
    issuerBaseURL: AUTH0_BASE_URL
};

const hbshelpers = hbs.create({ helpers });

app.engine('handlebars', hbshelpers.engine);
app.set('view engine', 'handlebars');

app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, 'public')))

//landing page initialized before auth config
app.get('/', (req, res) => {
    res.render('home')
})

app.use(auth(config));

app.use('/projects', projectRoutes);
app.use('/dashboard', homeRoutes);
app.use('/projects', taskRoutes);
app.use('/tasks', allTaskRoute);

module.exports = app

