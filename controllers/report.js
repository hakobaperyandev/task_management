import Task from '../models/task.js'

export const reportByPeriod = async (req, res) => {
    const { startDate, endDate, member } = req.body;
    const filter = { status: 'complete' };

    if (startDate && endDate) {
        filter.completedAt = { 
            $gte: new Date(startDate), 
            $lte: new Date(endDate) 
        };
    }

    if (member) {
        filter.assignedMember = member;
    }

    try {
        const tasks = await Task.find(filter);
        res.json({
            status: true,
            data: tasks
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            errors: "error"
        });
    }
};


export const summary = async (req, res) => {
    try {
        const completedTasks = await Task.find({ status: 'complete' });
        const totalTasks     = completedTasks.length;
        const timeAvgMs      = completedTasks.reduce((acc, task) => acc + (new Date(task.dueDate) - new Date(task.createdAt)), 0) / totalTasks;

        
        const timeAvgHours = timeAvgMs / (1000 * 60 * 60);
            
        const days    = Math.floor(timeAvgHours / 24);
        const hours   = Math.floor(timeAvgHours % 24);
        const minutes = Math.floor((timeAvgHours * 60) % 60);
    
        res.json({
            status: true,
            totalTasks,
            timeAvg: `${days} days, ${hours} hours, ${minutes} minutes`
        });
    } catch (error) {
        res.status(500).json({
            status: false,
            errors: error
        });
    }
};
