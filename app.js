const express = require('express');
const cors = require('cors');
const db = require("./connection/connection")
// const User = require('./models/User')
// const routes = require('./routes')
const projectRoutes = require('./routes/projectRoute')
const homeRoutes = require('./routes/homeRoute');

const app = express()
const PORT = 4000

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}));


// app.get('/', (req, res) => {
//     res.send("<h1>hello</h1>")
// })

// app.post('/user', async (req, res) => {
//     try{
//         await User.create({username: req.body.username});
//         res.send('user added')

//     }catch(err){
//         console.log(err)
//     }
// })

// app.get('/users', async (req, res) => {
//     try{
//         res.send(await User.find({}))

//     }catch(err){
//         console.log(err)
//     }
// })

app.use('/projects', projectRoutes);
app.use('/users', homeRoutes);

db.once('open', () => {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`)
    }) 
})
