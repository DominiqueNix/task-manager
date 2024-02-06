const { Project } = require('../models');

//finds one project based on id from params, then check if the user
//is authorized by chekcing the collaborators on the project
async function projectAuth(req, res, next) {

    // finds the id of the current user (from auth0)
    let userId = req.oidc.user.sid;

    //finds the projects from the params
    let project = await Project.findById(req.params.projectId).populate('tasks');

    if(project) {
        //keep track of users who are collaborators on this project 
        let authUsers = project.collaborators;
        //The current user only has access if they are a collaborator 
        if(authUsers.includes(userId)){
            req.project = project; 

            //ensures that a user cannont be added as an assignee to a task unless they are a collborator on the project
            const userCanBeAdded = [];
            if(req.body.assignees) {
                req.body.assignees.forEach(user => {
                    if(!req.project.collaborators.includes(user)) {
                        userCanBeAdded.push(false);
                    } else {
                        userCanBeAdded.push(true)
                    }
                })
            }
    
            if(userCanBeAdded.includes(false)){
                res.send("cannot add users who are not collaborators on the project")
            } else {
              next()  
            }  
        } else {
            res.send("not authorized")
        }
    }else{
        res.send('no project found')
    }
}


module.exports = projectAuth;