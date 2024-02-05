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
        //creating the project
        let project = await Project.create(req.body);

        //setting current user as the owner and add them as a collaborator
        await Project.findByIdAndUpdate(
            project._id, 
            {
                $set: {owner: userId}, 
                $addToSet: {collaborators: userId}
            }
        )

        //adding project to user model
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


//delete a project and all associated tasks
router.delete('/:projectId', projectAuth ,async (req, res) => {
    try{
        if(req.project.tasks) {
           for(let i = 0; i < req.project.tasks.length; i++) {
                await Task.findByIdAndDelete(req.project.tasks[i]._id)
            } 
        }

        await Project.findByIdAndDelete(req.project._id);
        res.send("project deleted")
    }catch(err){
        console.log(err)
    }
})


module.exports = router;