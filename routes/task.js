import express from 'express';
const router = express.Router();
import {
    createTask, 
    updateTaskStatus, 
    showAllTasks, 
    showTask
} from '../controllers/task.js';


router.post('/tasks', createTask);
router.put('/tasks/:id', updateTaskStatus);
router.get('/tasks/:id', showTask);
router.get('/tasks', showAllTasks);

export default router;
