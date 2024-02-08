const router = require('express').Router();

const {projectAuth} = require('../middleware/auth');
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

    }catch(err){
        console.log(err)
    }
})


//update a task
router.put('/:projectId/tasks/:taskId', projectAuth, async (req, res) => {

    try{
      //find task, then add the current assignees to the req.body so they aren't lost upon update
    // let task = await Task.findById(req.params.taskId);

    // if(req.body.assignees){
    //     task.assignees.forEach(user => req.body.assignees.push(user))
    // }

    await Task.findByIdAndUpdate(
        req.params.taskId, 
        {$set: req.body}
    )  
    res.send("task updated")
    }catch(err){
        console.log(err)
    }
    
})


//delete a task
router.delete('/:projectId/tasks/:taskId', projectAuth, async (req, res) => {
    try{
      await Task.findByIdAndDelete(req.params.taskId); 
      res.send('task deleted') 
    }catch(err){
        console.log(err)
    }
})

module.exports = router;