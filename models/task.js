import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: { 
        type: String, 
        required: true 
    },
    description: { type: String },
    dueDate: { type: Date },
    priority: { 
        type: String, 
        enum: ['low', 'medium', 'high'], 
        default: 'medium' 
    },
    assignedMember: { type: String },
    status: { 
        type: String, 
        enum: ['pending', 'in progress', 'complete'], 
        default: 'pending' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    completedAt: { type: Date }
});
const Task = mongoose.model('Task', taskSchema);

export default Task
