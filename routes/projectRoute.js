const router = require('express').Router();
const {User, Project, Task} = require('../models');
const projectAuth = require('../middleware/auth')

//get all projects (testing purposes)
router.get('/', async (req, res) => {
    try{
        res.send(await Project.find())
    }catch(err){
        console.log(err)
    }
})

//get one project (only if you have access)
router.get('/:projectId', projectAuth ,async (req, res) => {
    try{
        res.send(req.project)     
    }catch(err){
        console.log(err)
    }
})

//create project
router.post('/', async (req, res) => {
    try{
        let userId = req.oidc.user.sid
        let project = await Project.create(req.body);
        await Project.findByIdAndUpdate(
            project._id, 
            {
                $set: {owner: userId}, 
                $addToSet: {collaborators: userId}
            }
        )
        await User.findOneAndUpdate(
            {id: userId}, 
            {$addToSet: {projects: project._id}}
        )
        res.send("project added")
    }catch(err){
        console.log(err)
    }
})

//update a project (tasks are handle in the taskRoutes; can't delete or add tasks froms the project edit endpoint)
router.put('/:projectId', projectAuth ,async(req, res) => {
    try{

        //will add any current collborators so that they aren't lost when 
        //req.body is being set
        if(req.body.collaborators){
            req.project.collaborators.forEach(col => req.body.collaborators.push(col)); 
        }

        let project = await Project.findByIdAndUpdate(
            {_id: req.project._id}, 
            {$set: req.body}
        )

        res.send(project)
    }catch(err){
        console.log(err)
    }
})


//delete a project 
//TODO: Decide if you want all tasks for that project deleted when proect is deleted 
    //I feel like yes. I don't think there should be any free floating tasks
    //tasks can only exist when attached to a project
router.delete()


module.exports = router;