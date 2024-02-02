const { Schema, model } = require('mongoose');

const projectSchema = new Schema(
    {
        title: {
            type: String, 
            required:true
        }, 
        description: String,
        endDate: Date, 
        onlyOwnerEdit: Boolean,
        tasks: [{
            type: Schema.Types.ObjectId, 
            ref: 'Task'
        }], 
        owner: {
            type: Number, 
            ref: 'User'
        }, 
        collaborators: [{
            type: Number, 
            ref: 'User'
        }],   
    }, 
    {
        timestamps: true
    }
)

const Project = model('Project', projectSchema);

module.exports = Project;