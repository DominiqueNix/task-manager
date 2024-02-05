const router = require('express').Router();

const projectAuth = require('../middleware/auth');
const {Project, Task} = require('../models');

//get one task
router.get('/:projectId/tasks/:taskId', projectAuth ,async (req, res) => {
    try{
        let task = await Task.findById(req.params.taskId);
        res.send(task)
    }catch(err){
        console.log(err)
    }
})

//create a task
router.post('/:projectId/tasks', projectAuth ,async (req, res) => {
    try{

        //make sure only people who are a part of the project can be assigned to the task
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
         //creating task
        let task = await Task.create(req.body);

        // adding task to project
        await Project.findByIdAndUpdate(
            req.project._id, 
            {
                $addToSet: {tasks: task._id}
            }
        )
        res.send("task added")   
        }
        

    }catch(err){
        console.log(err)
    }
})


//update a task

//delete a task

module.exports = router;