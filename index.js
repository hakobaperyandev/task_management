import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import taskRoutes from './routes/task.js';
import reportRoutes from './routes/report.js';
import dotenv from 'dotenv'

dotenv.config()
const app = express();
app.use(bodyParser.json());

app.use(taskRoutes);
app.use(reportRoutes);


const PORT = process.env.PORT || 3000
const MONGO_DB_URL = process.env.DATABASE_URL || 'mongodb://localhost/task_management' 

mongoose.connect(MONGO_DB_URL, { useNewUrlParser: true })
    .then(() => {
        console.log('Connected....')
        app.listen(PORT)
    })
    .catch((err) => console.error(' MongoDB Connection error ...', err));
    