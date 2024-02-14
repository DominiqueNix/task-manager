const { Schema, model } = require('mongoose');

const projectSchema = new Schema(
    {
        title: {
            type: String, 
            required:true
        }, 
        description: String,
        onlyOwnerEdit: Boolean,
        tasks: [{
            type: Schema.Types.ObjectId, 
            ref: 'Task'
        }], 
        owner: {
            type: Schema.Types.ObjectId, 
            ref: 'User'
        }, 
        collaborators: [{
            type: Schema.Types.ObjectId, 
            ref: 'User'
        }],   
    }, 
    {
        timestamps: true
    }
)

const Project = model('Project', projectSchema);

module.exports = Project;