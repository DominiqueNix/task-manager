const { Project } = require('../models');

//finds one project based on id from params, then check if the user
//is authorized by chekcing the collaborators on the project
async function projectAuth(req, res, next) {

    let userId = req.oidc.user.sid;
    let project = await Project.findById(req.params.projectId);
    let authUsers = project.collaborators;

    if(project && authUsers.includes(userId)) {
        req.project = project;
        next()
    }else{
        res.send('not authorized')
    }
}

module.exports = projectAuth;