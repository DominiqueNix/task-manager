const router = require('express').Router();

const {projectAuth} = require('../middleware/auth');
const {Project, Task, User} = require('../models');

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

         //creating task
        let task = await Task.create(req.body);
        //iterate through assignees and add this task each users task list
        if(req.body.assignees){         
            for(let i = 0; i < req.body.assignees.length; i++) {
                await User.findByIdAndUpdate(
                    req.body.assignees[i], 
                    {$addToSet: {tasks: task._id}}
                )
            }
        }

        // add task to project
        await Project.findByIdAndUpdate(
            req.project._id, 
            {
                $addToSet: {tasks: task._id}
            }
        )

        res.status(201).send("task added")   

    }catch(err){
        console.log(err)
    }
})


//update a task
router.put('/:projectId/tasks/:taskId', projectAuth, async (req, res) => {

    try{
        let task = await Task.findById(req.params.taskId);
        // updates assingee task list 
        if(req.body.assignees){
            // pull task out of all current assignees task list
            for(let i = 0; i < task.assignees.length; i++){
                await User.findByIdAndUpdate(
                    task.assignees[i], 
                    {$pull: {tasks: task._id}}
                )
            }

            // add task to users who are selected
            for(let i = 0; i < req.body.assignees.length; i++){
                await User.findByIdAndUpdate(
                    task.assignees[i], 
                    {$addToSet: {tasks: task._id}}
                )
            }   
        }

        //updates the task
        await Task.findByIdAndUpdate(
            req.params.taskId, 
            {$set: req.body}
        )  
        res.status(200).send("task updated")
    }catch(err){
        console.log(err)
    }
    
})


//delete a task
router.delete('/:projectId/tasks/:taskId', projectAuth, async (req, res) => {
    try{
    //delete task
    await Task.findByIdAndDelete(req.params.taskId); 

    //delete task from project
    await Project.findByIdAndUpdate(
        req.params.projectId, 
        {$pull: {tasks: req.params.taskId}}
    )

    //detele task forn users tasklist 
    await User.findOneAndUpdate(
        {email: req.oidc.user.email}, 
        {$pull: {tasks: req.params.taskId}}
        )

      res.send('task deleted') 
    }catch(err){
        console.log(err)
    }
})

module.exports = router;