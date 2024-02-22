const router = require('express').Router();
const {User } = require('../models');

router.get('/', async(req, res) => {
    try{
        let user = await User.findOne({email: req.oidc.user.email}).populate({ 
            path: "tasks", 
            populate: {
                path: "assignees", 
                select: "email",
                model: "User"
            }}).populate({
                path: 'projects', 
                populate: {
                    path: "collaborators", 
                    model: "User"
                }
            }).lean()
        res.render("tasks", {user: user})
        // console.log('hi')
    }catch(err){
        console.error(err)
    }
})

module.exports = router;