const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        id: {
            type: Number, 
            unique: true, 
            required: true,
        }, 
        projects: [{
            type: Schema.Types.ObjectId, 
            ref: 'Project', 
        }], 
        tasks: [{
            type: Schema.Types.ObjectId, 
            ref: 'Task', 
        }],
    }, 
    {
        _id: false
    }
)

const User = model('User', userSchema);

module.exports = User;