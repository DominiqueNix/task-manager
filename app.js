require('dotenv').config();
const express = require('express');
const cors = require('cors');
const {auth} = require('express-openid-connect')
const db = require("./connection/connection")
const projectRoutes = require('./routes/projectRoute')
const homeRoutes = require('./routes/homeRoute');

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

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}));

app.use(auth(config));

app.use('/projects', projectRoutes);
app.use('/dashboard', homeRoutes);

db.once('open', () => {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`)
    }) 
})
