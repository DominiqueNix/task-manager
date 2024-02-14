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
            type: Schema.Types.ObjectId, 
            ref: 'User'
        }],
    }
)

const Task = model('Task', taskSchema);
module.exports = Task;