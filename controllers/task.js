import Task from '../models/task.js';
import { createTaskSchema, updateTaskSchema } from '../validations/taskValidation.js';


export const showAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find(); 
        res.status(200).json({ 
            status: true,
            data: tasks 
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            errors: error
        });
    }
};


export const createTask = async (req, res) => {    
    
    const validatedData = createTaskSchema.validate(req.body)
    
    if (validatedData.error) {
        return res.status(400).json({
            status: false,
            errors: validatedData.error.details
        })
    }

    try {
        const task = new Task(validatedData.value);
        await task.save();
        res.status(201).send({
            status: true,
            data: task
        });
    } catch (error) {
        res.status(400).send({
            status: false,
            errors: error
        });
    }
};


export const updateTaskStatus = async (req, res) => {
    const validatedData = updateTaskSchema.validate(req.body);
    if (validatedData.error) {
        return res.status(400).json({
            status: false,
            errors: validatedData.error.details
        })
    }
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).send({ message: 'Task not found' });

        task.status = req.body.status;
        if (task.status === 'complete') task.completedAt = new Date();
        await task.save();
        res.json({
            status: true,
            data: task 
        });
    } catch (error) {
        res.status(400).json({
            status: false,
            errors: error
        });
    }
};


export const showTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ status: false, message: 'Task not found' });
        res.status(200).json({
            status: true,
            data: task
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            errors: error
        });
    }
};
