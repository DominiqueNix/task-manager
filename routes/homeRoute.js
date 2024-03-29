
const router = require('express').Router();
const {User, Project, Task} = require('../models')

// find all users
router.get('/users', async(req, res) => {
    try{
       res.send(await User.find().select("_id email"));

    }catch(err){
        console.log(err)
    }
})

//get all projects and tasks for a user
router.get('/', async (req, res) => {
    try{
        let email = req.oidc.user.email;
        let user = await User.findOne({email: email}).populate({
            path: "projects", 
            populate: {
                path: "collaborators", 
                model: "User", 
            }
        }).populate({
            path: "projects", 
            populate: {
                path: "tasks", 
                model: "Task", 
            }
        }).populate({
            path: "tasks", 
            populate: {
                path:"assignees",
                select: "email", 
                model: "User"
            }
        }).lean();
        if(!user) {
            user = await User.create({email: email})
        } 
        res.render('dashboard', {
            user: user,
            username: req.oidc.user.username ?req.oidc.user.username : req.oidc.user.email
          })
    }catch(err){
        console.log(err)
    }
});

module.exports = router;