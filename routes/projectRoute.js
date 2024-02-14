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
        // res.send(req.project)
        res.render(
            "oneProject", 
            {project: req.project}
        )     
    }catch(err){
        console.log(err)
    }
})

//create project (can't add tasks from this point)
router.post('/', async (req, res) => {
    try{
        let user = await User.findOne({email: req.oidc.user.email});

        //creating the project using allwo listing
        const {title, description, onlyOwnerEdit, collaborators} = req.body;

        let project = await Project.create({title, description, onlyOwnerEdit, collaborators});

        //setting current user as the owner and add them as a collaborator
        await Project.findByIdAndUpdate(
            project._id, 
            {
                $set: {owner: user._id}, 
                $addToSet: {collaborators: user._id}
            }
        )

        //adding project to user model
        await User.findByIdAndUpdate(
             user._id, 
            {$addToSet: {projects: project._id}}
        )
        res.status(201).send("project added")
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

        //updating a project 
        const {title, description, collaborators} = req.body;

       await Project.findByIdAndUpdate(
            {_id: req.project._id}, 
            {$set: {
                title: title, 
                description: description, 
                collaborators: [req.project.owner]
                }
            }
        )

        if(collaborators) {
            await Project.findByIdAndUpdate(req.project._id,{$addToSet: {collaborators: [...collaborators]}})
        }

        //Checks if a user is deleted as a collborator, if so, they are also deleted from any task they might have been assigned
        if(req.body.collaborators) {
            let updatedProject = await Project.findById(req.project._id);
            let authUsers = updatedProject.collaborators;

            for(let i = 0; i < updatedProject.tasks.length; i++) {
                let task = updatedProject.tasks[i];
                let eachtask = await Task.findById(task._id)
                let assignees = eachtask.assignees;
                let newAssignees = [];
                for(let j=0; j< assignees.length; j++){

                    if(authUsers.includes(assignees[j])){
                        
                        newAssignees.push(assignees[j])
                    } else {
                        continue
                    }
                }
                await Task.findByIdAndUpdate(
                    task._id, 
                    {$set: {assignees: newAssignees}}
                    )
            }
        }

        res.status(200).send("project updated")
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