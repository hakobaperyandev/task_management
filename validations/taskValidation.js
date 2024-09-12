import Joi from "joi";

export const createTaskSchema = Joi.object({
    title: Joi.string().min(3).max(100).required(),
    description: Joi.string().required(),
    dueDate: Joi.date().optional(),
    priority: Joi.string().valid('low', 'medium', 'high').default('medium'),
    assignedMember: Joi.string().min(3).max(100).required(),
    status: Joi.string().valid('pending', 'in progress', 'complete').default('pending')
});

export const updateTaskSchema = Joi.object({
    status: Joi.string().valid('pending', 'in progress', 'complete').required()
});

