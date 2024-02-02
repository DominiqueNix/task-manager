const { Schema, model } = require('mongoose');

const taskSchema = new Schema(
    {
        title: {
            type: String, 
            required:true
        }, 
        description: String,
        dueDate: Date, 
        priority: String, 
        status: String,
        assignees: [{
            type: String, 
            ref: 'User'
        }],
    }
)

const Task = model('Task', taskSchema);
module.exports = Task;