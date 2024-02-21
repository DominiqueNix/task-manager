const router = require('express').Router();

const {projectAuth} = require('../middleware/auth');
const {Project, Task, User} = require('../models');

router.get('/tasks',async (req, res) => {
    try{
        // let user = await User.findOne({email: req.oidc.user.email}).populate({
        //     path: "tasks", 
        //     populate: {
        //         path: "assignees", 
        //         model: "User"
        //     }
        // }).lean();
        // res.render("tasks")
        res.send("<h1>Hi</h1>")
    }catch(err){
        console.err(err)
    }
})

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
            // let user = await User.findOne({_id: userId})
            // let userTasks = user.tasks;

            // if(!userTasks.includes(req.params.taskId)) {
            //     userTasks.push(req.params.taskId)
            // }
            // console.log(user.tasks)

            await User.findByIdAndUpdate(
                userId, 
                {$addToSet: {tasks: req.params.taskId}}
            )
        }
        
    }

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
      res.send('task deleted') 
    }catch(err){
        console.log(err)
    }
})

module.exports = router;