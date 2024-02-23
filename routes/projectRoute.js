const router = require('express').Router();
const {User, Project, Task} = require('../models');
const { projectAuth, projectAdmin } = require('../middleware/auth')

//get all projects for a user
router.get('/',async (req, res) => {
    try{
        let user = await User.findOne({email: req.oidc.user.email}).populate({
            path: "projects", 
            populate: {
                path: "collaborators", 
                model: "User"
            }

        }).populate("tasks").lean();
        res.render("projects", {user: user})
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
            {project: req.project, user: req.user}
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

        //adding this projeoct to all collabortors project list
        if(req.body.collaborators){         
            for(let i = 0; i < req.body.collaborators.length; i++) {
                await User.findByIdAndUpdate(
                    req.body.collaborators[i], 
                    {$addToSet: {projects: project._id}}
                )
            }
        }

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

        //updating a project 
        const {title, description, collaborators, onlyOwnerEdit} = req.body;
 
       await Project.findByIdAndUpdate(
            {_id: req.project._id},
            {$set: {
                title: title, 
                description: description,
                onlyOwnerEdit: onlyOwnerEdit, 
                collaborators: [...collaborators, req.project.owner]
            }
            }
        )
          
        //Checks if a user is deleted as a collborator, if so, they are also deleted from any task they might have been assigned
        //If no assignees exists on that task, the owner is automatically added instead 
        // or I could create update task on the project view as well
        if(req.body.collaborators) {


            let updatedProject = await Project.findById(req.project._id);

            let authUsers = []
            updatedProject.collaborators.forEach(u => authUsers.push(u._id));

            for(let i = 0; i < updatedProject.tasks.length; i++) {
                    let task = updatedProject.tasks[i]
                    let eachtask = await Task.findById(task)
                    
                    let assignees = []
                    let newAssignees = []

                    if(eachtask.assignees){
                        
                        eachtask.assignees.forEach(u => assignees.push(u));

                        assignees.forEach(a => {
                            authUsers.forEach(authU => {
                                if(a.equals(authU)){
                                    newAssignees.push(a)
                                }
                            })
                        })
                        await Task.findByIdAndUpdate(
                            task._id, 
                            {$set: {assignees: newAssignees}}
                        )

                    }             
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