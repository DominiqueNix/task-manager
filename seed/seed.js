const db = require('../connection/connection');
const {User, Task, Project} = require('../models');
const userSeed = require('./userData.json');
const taskSeed = require('./taskData.json');
const projectSeed = require('./projectData.json');

db.once('open', async () => {
    try{
        //emptying the database
        await User.deleteMany({})
        await Task.deleteMany({})
        await Project.deleteMany({})

    //     //adding users/projects/tasks to the database
    //     const users = await User.insertMany(userSeed);
    //     const projects = await Project.insertMany(projectSeed);
    //     const tasks = await Task.insertMany(taskSeed);

    //     //adding 2 projects to a user
    //     for(let i = 0; i < users.length; i++) {
    //         for(let j = i*2; j < (i*2)+2; j++) {
    //         await User.findOneAndUpdate(
    //             {id: users[i].id}, 
    //             {$addToSet: {projects: projects[j]._id}}, 
    //         )
    //         }
    //     }

    //     //add 4 tasks to a user
    //     for(let i = 0; i < users.length; i++) {
    //         for(let j = i*4; j < (i*4)+4; j++) {
    //             await User.findOneAndUpdate(
    //                 {id: users[i].id}, 
    //                 {$addToSet: {tasks: tasks[j]._id}}, 
    //             )
    //             users[i].tasks.push(tasks[j]._id)
    //         }  
    //     }

    //     //add 2 tasks to a projects
    //     for(let i = 0; i < projects.length; i++) {
    //         for(let j = i*2; j < (i*2)+2; j++) {
    //             await Project.findOneAndUpdate(
    //                 {_id: projects[i]._id}, 
    //                 {$addToSet: {tasks: tasks[j]._id}}, 
    //             )
    //         }
    //     }

    //     //add an owner to a project and adds the owner as a collaborator
    //     for(let i = 0; i < users.length; i++){
    //             // projects[i*2].owner = users[i].id;
    //             // projects[i*2].collaborators.push(users[i].id);
    //             await Project.findOneAndUpdate(
    //                 {_id: projects[i*2]._id}, 
    //                 {
    //                     $set: {owner: users[i].id}, 
    //                     $addToSet: {collaborators: users[i].id}
    //                 }
    //             )
    //             await Project.findOneAndUpdate(
    //                 {_id: projects[(i*2)+1]._id}, 
    //                 {
    //                     $set: {owner: users[i].id}, 
    //                     $addToSet: {collaborators: users[i].id}
    //                 }
    //             )
    //     }

    // // add one more collaborator to a project randomly
    //     for(let i =0; i < projects.length; i++){
    //         await Project.findOneAndUpdate(
    //                 {_id: projects[i]._id}, 
    //                 {$addToSet: {collaborators: users[Math.floor(Math.random()*users.length)].id}}
    //             )
    //     }

    //     //add assignees to a task
    //     for(let i = 0; i < users.length; i++) {
    //         for(let j = 0; j < 4; j++){
    //             // let taskId = await Task.findOne({_id: })
    //             // task.assignees.push(users[i].id)

                
    //             await Task.findOneAndUpdate(
    //                 {_id: users[i].tasks[j]._id}, 
    //                 {$addToSet: {assignees: users[i].id}}
    //             )
    //         }
    //     }

    //Add projects 
    //add two tasks to each project

        console.log("database seeded");
        process.exit(0);

    } catch(err) {
        console.error(err)
        process.exit(0);
    }
})