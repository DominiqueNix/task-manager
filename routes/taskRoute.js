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
                await User.findOneAndUpdate(
                    {id: req.body.assignees[i]}, 
                    {$addToSet: {tasks: task}}
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
    // let task = await Task.findById(req.params.taskId)

    // let newAssignees = req.body.assignees.filter(userId => !task.assignees.includes(userId))
    
    // newAssignees.forEach(user => {req.body.assignees.push(user)})

    //check if a req.body.assignees exists 
        //if so then for each assigne => find user e, add the task id to thier task list if the task id doenst already exists 
    if(req.body.assignees){
        for(let i = 0; i < req.body.assignees.length; i++){
            let userId = req.body.assignees[i]
            let user = await User.findOne({id: userId})
            let userTasks = user.tasks;

            if(!userTasks.includes(req.params.taskId)) {
                userTasks.push(req.params.taskId)
            }

            await User.findOneAndUpdate(
                {id: userId}, 
                {$set: {tasks: userTasks}}
            )
        }
    }
    

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