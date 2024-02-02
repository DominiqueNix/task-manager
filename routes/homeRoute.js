//need to create a /dashboard route that requres auth
//within this route I will grab the genereated access token 
// check if the user id matches one in my database, if not, add user
const router = require('express').Router();
const {User, Project, Task} = require('../models')
// router.get('/users', async)

//get all projects and tasks for a user
router.get('/:userId', async (req, res) => {
    try{
        let user = await User.findOne({id: req.params.userId}).populate("projects").populate("tasks")
        res.send(user)
    }catch(err){
        console.log(err)
    }
});

module.exports = router;