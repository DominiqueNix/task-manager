
const router = require('express').Router();
const {User, Project, Task} = require('../models')
// router.get('/users', async)

//get all projects and tasks for a user
router.get('/', async (req, res) => {
    try{
        let id = req.oidc.user.sid;
        let user = await User.findOne({id:id}).populate("projects").populate("tasks");
        if(user) {
            res.send(user)
        } else {
            await User.create({id: id})
            res.send("Welcome new user")
        }
    }catch(err){
        console.log(err)
    }
});

module.exports = router;