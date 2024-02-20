const { Project, User } = require('../models');

const middleware = {
    projectAuth: async function(req, res, next){
    // finds the current user (from auth0 email)
    let currUser = await User.findOne({email: req.oidc.user.email});
    //finds the projects from the params
    let project = await Project.findById(req.params.projectId).populate('tasks').lean();
    req.user = currUser;
    if(project) {
            //keep track of users who are collaborators on this project 
            let authUsers = [];
            project.collaborators.forEach(user => currUser._id.equals(user._id) ? authUsers.push(true) : authUsers.push(false));

            //The current user only has access if they are a collaborator 
            if(authUsers.includes(true)){
                req.project = project; 

                //ensures that a user cannont be added as an assignee to a task unless they are a collborator on the project
               if(req.body.assignees){ 
                    const userCanBeAdded = [];
                    for(let j = 0; j <req.project.collaborators.length; j++) {
                        for(let i = 0; i < req.body.assignees.length; i++){
                            let user = await User.findById(req.body.assignees[i])
                            if(req.project.collaborators[j].equals(user._id)){
                                userCanBeAdded.push(true)
                            }
                        }
                    }
                    if(userCanBeAdded.length !== req.body.assignees.length){
                        res.status(401).send("cannot add users who are not collaborators on the project")
                    }
                }
                next()
            } else {
                res.status(401).render("notAuth")
            }
        }else{
            res.status(404).send('no project found')
        }
    }, 

    projectAdmin: async function(req, res, next){
         // finds the current user (from auth0 email)
         let currUser = await User.findOne({email: req.oidc.user.email});

        //finds the projects from the params
        let project = await Project.findById(req.params.projectId).populate('tasks');

        // checks the permissions of the project and checks if the current user is the project owner
        if(project.onlyOwnerEdit === true && !currUser._id.equals(project.owner)){
            res.status(401).send("Not authorized to edit project")
        } else {
            next()
        }
    }


}

module.exports = middleware;