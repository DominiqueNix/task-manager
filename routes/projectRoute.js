const router = require('express').Router();
const {User, Project, Task} = require('../models');
const { projectAuth, projectAdmin } = require('../middleware/auth')

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

//create project (can't add tasks from this point)
router.post('/', async (req, res) => {
    try{
        let userId = req.oidc.user.sid

        //creating the project
        const {title, description, onlyOwnerEdit, collaborators} = req.body;

        let project = await Project.create({title, description, onlyOwnerEdit, collaborators});

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

//update a project (tasks are handle in the taskRoutes; can't delete or add tasks from the project edit endpoint)
router.put('/:projectId', [projectAuth, projectAdmin] ,async(req, res) => {
    try{

        //will add any current collborators so that they aren't lost when !!!Prevents deleting collaborators => should maybe be handled on front-end
                // => so in FE form automatically populates all collaborators (minus owner b/c they can't be removed/and it's automatically hanlded in back)
        //req.body is being set
        // if(req.body.collaborators){
        //     req.project.collaborators.forEach(col => req.body.collaborators.push(col)); 
        // }

        const {title, description, collaborators} = req.body;

        let project = await Project.findByIdAndUpdate(
            {_id: req.project._id}, 
            {$set: {
                title: title, 
                description: description, 
                collaborators: [...collaborators, req.project.owner]
                }
            }
        )

        res.send(project)
    }catch(err){
        console.log(err)
    }
})


//delete a project and all associated tasks
router.delete('/:projectId', [projectAuth, projectAdmin] ,async (req, res) => {
    try{
        //delete all tasks for a project
        if(req.project.tasks) {
           for(let i = 0; i < req.project.tasks.length; i++) {
                await Task.findByIdAndDelete(req.project.tasks[i]._id)
            } 
        }

        //delete project
        await Project.findByIdAndDelete(req.project._id);
        res.send("project deleted")
    }catch(err){
        console.log(err)
    }
})


module.exports = router;