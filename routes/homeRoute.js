
const router = require('express').Router();
const {User, Project, Task} = require('../models')
// router.get('/users', async)

// find all users (testing only)
router.get('/users', async(req, res) => {
    try{
       res.send(await User.find());

    }catch(err){
        console.log(err)
    }
})

//get all projects and tasks for a user
router.get('/', async (req, res) => {
    try{
        let id = req.oidc.user.sid;
        let user = await User.findOne({id:id}).populate("projects").populate("tasks").lean();

        if(user) {
            res.render('dashboard', {
              user: user,
              username: req.oidc.user.username ?req.oidc.user.username : req.oidc.user.email
            })
        } else {
            await User.create({id: id})
            res.send("Welcome new user")
        }
    }catch(err){
        console.log(err)
    }
});

module.exports = router;