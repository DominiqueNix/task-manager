const { Project } = require('../models');

const middleware = {
    projectAuth: async function(req, res, next){

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
    }, 

    projectAdmin: async function(req, res, next){
         // finds the id of the current user (from auth0)
        let userId = req.oidc.user.sid;

        //finds the projects from the params
        let project = await Project.findById(req.params.projectId).populate('tasks');

        // checks the permissions of the project and checks if the current user is the project owner
        if(project.onlyOwnerEdit === true && userId !== project.owner){
            res.send("Not authorized to edit project")
        } else {
            next()
        }
    }


}

//finds one project based on id from params, then check if the user
//is authorized by chekcing the collaborators on the project
// async function projectAuth(req, res, next) {

//     // finds the id of the current user (from auth0)
//     let userId = req.oidc.user.sid;

//     //finds the projects from the params
//     let project = await Project.findById(req.params.projectId).populate('tasks');

//     if(project) {
//             //keep track of users who are collaborators on this project 
//             let authUsers = project.collaborators;
//             //The current user only has access if they are a collaborator 
//             if(authUsers.includes(userId)){
//                 req.project = project; 

//                 //ensures that a user cannont be added as an assignee to a task unless they are a collborator on the project
//                 const userCanBeAdded = [];
//                 if(req.body.assignees) {
//                     req.body.assignees.forEach(user => {
//                         if(!req.project.collaborators.includes(user)) {
//                             userCanBeAdded.push(false);
//                         } else {
//                             userCanBeAdded.push(true)
//                         }
//                     })
//                 }
        
//                 if(userCanBeAdded.includes(false)){
//                     res.send("cannot add users who are not collaborators on the project")
//                 } else {
//                 next()  
//                 }  
//             } else {
//                 res.send("not authorized")
//             }
//     }else{
//         res.send('no project found')
//     }
// }


module.exports = middleware;