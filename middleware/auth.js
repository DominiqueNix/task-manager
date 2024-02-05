const { Project } = require('../models');

//finds one project based on id from params, then check if the user
//is authorized by chekcing the collaborators on the project
async function projectAuth(req, res, next) {

    // finds the id of the current user (from auth0)
    let userId = req.oidc.user.sid;

    //finds the projects from the params
    let project = await Project.findById(req.params.projectId);
    if(project) {
        
        //keep track of users who are collaborators on this project 
        let authUsers = project.collaborators;

        //The current user only has access if they are a collaborator 
        if(authUsers.includes(userId)){


            req.project = project;  
            next()
        } else {
            res.send("not authorized")
        }
    }else{
        res.send('no project found')
    }
}


module.exports = projectAuth;