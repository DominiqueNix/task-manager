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

        }).populate("tasks");
        res.send(user)
    }catch(err){
        console.log(err)
    }
})

//get one project
router.get('/:projectId', projectAuth ,async (req, res) => {
    try{
        res.render(
            "oneProject", 
            {project: req.project, user: req.user}
        )     
    }catch(err){
        console.log(err)
    }
})

//create project
router.post('/', async (req, res) => {
    try{
        let user = await User.findOne({email: req.oidc.user.email});

        //creating the project using allow listing
        const {title, description, onlyOwnerEdit, collaborators} = req.body;

        let project = await Project.create({title, description, onlyOwnerEdit, collaborators});

        //adding this project to all collabortors project list
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

//update a project
router.put('/:projectId', [projectAuth, projectAdmin] ,async(req, res) => {
    try{

        //updating a project 
        const {title, description, collaborators, onlyOwnerEdit} = req.body;

        let allCollabs = [...collaborators, req.project.owner];

        // get not updated project
        let notupdated = await Project.findById(req.project._id)

        //iteratre over current users and pull the project id from each
        for(let i = 0; i < notupdated.collaborators.length; i++){
            await User.findByIdAndUpdate(
                notupdated.collaborators[i]._id, 
                {$pull: {projects: notupdated._id}}
            )
        }

        //iterate over selected users and add project to each person's project list (plus ower)
        for(let i = 0; i < allCollabs.length; i++){
            await User.findByIdAndUpdate(
                allCollabs[i], 
                {$addToSet: {projects: notupdated._id}}
            )
        }
 
       await Project.findByIdAndUpdate(
            {_id: req.project._id},
            {$set: {
                title: title, 
                description: description,
                onlyOwnerEdit: onlyOwnerEdit, 
                collaborators: allCollabs
            }
            }
        )
          
        if(req.body.collaborators) {
            //updates tasks if a user was deleted from project
            let updatedProject = await Project.findById(req.project._id);
            let authUsers = []
            updatedProject.collaborators.forEach(u => authUsers.push(u._id));

            for(let i = 0; i < updatedProject.tasks.length; i++) {
                    let task = updatedProject.tasks[i]
                    let eachtask = await Task.findById(task)
                    
                    let assignees = []
                    let newAssignees = []

                    if(eachtask.assignees){

                        for(let  i = 0; i < eachtask.assignees.length; i++){
                           assignees.push(eachtask.assignees[i])

                           await User.findByIdAndUpdate(
                                eachtask.assignees[i], 
                                {$pull: {tasks: eachtask._id}}
                           )
                        }

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

                        for(let  i = 0; i < newAssignees.length; i++){
                            assignees.push(newAssignees[i])
 
                            await User.findByIdAndUpdate(
                                 newAssignees[i], 
                                 {$pull: {tasks: eachtask._id}}
                            )
                         }

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
        //delete all tasks for a project and delete tasks form a user's tasklist
        if(req.project.tasks) {
           for(let i = 0; i < req.project.tasks.length; i++) {
                //delete all project's tasks from each collaborators task list
                for(let j=0; j < req.project.collaborators.length; j++){
                    let collab = req.project.collaborators[j];
                    await User.findByIdAndUpdate(
                        collab._id, 
                        {$pull: {tasks:req.project.tasks[i]._id}}
                    )
                }

                await Task.findByIdAndDelete(req.project.tasks[i]._id)
            } 
        }

        //delete projectid from all collaborators project list
        for(let i=0; i < req.project.collaborators.length; i++){
            let collab = req.project.collaborators[i];
            await User.findByIdAndUpdate(
                collab._id, 
                {$pull: {projects: req.project._id}}
            )
        }

        //delete project
        await Project.findByIdAndDelete(req.project._id);

        res.send("project deleted")
    }catch(err){
        console.log(err)
    }
})


module.exports = router;