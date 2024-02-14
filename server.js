const db = require("./connection/connection")
const app = require('./app')
const PORT = process.env.PORT || 4000;

db.once('open', () => {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`)
    }) 
})
