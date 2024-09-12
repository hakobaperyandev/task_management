import { expect } from 'chai';
import sinon from 'sinon';
import mongoose from 'mongoose';
import Task from '../models/task.js'; 
import { createTaskSchema, updateTaskSchema } from '../validations/taskValidation.js';
import { showAllTasks, createTask, updateTaskStatus, showTask } from '../controllers/task.js'; 

describe('Task Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {};
        res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy(),
            send: sinon.spy()
        };
    });

    describe('showAllTasks', () => {
        it('should return all tasks', async () => {
            const tasks = [{ title: 'Test Task' }];
            sinon.stub(Task, 'find').returns(Promise.resolve(tasks));

            await showAllTasks(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({
                status: true,
                data: tasks
            })).to.be.true;

            Task.find.restore();
        });

        it('should handle errors', async () => {
            sinon.stub(Task, 'find').returns(Promise.reject(new Error('Database Error')));

            await showAllTasks(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({
                status: false,
                errors: sinon.match.instanceOf(Error)
            })).to.be.true;

            Task.find.restore();
        });
    });

    describe('createTask', function() {
       beforeEach(function() {
            sinon.restore();
        });
    
        it('should create a new task', async function() {
            req.body = { title: 'New Task', description: 'Description', assignedMember: 'John Doe' };
            const validatedData = { value: req.body };
            const task = { ...req.body, save: sinon.stub().returns(Promise.resolve()), status: 'pending' };
        
            sinon.stub(createTaskSchema, 'validate').returns(validatedData);
            sinon.stub(Task.prototype, 'save').returns(Promise.resolve(task));
        
            res.status = sinon.stub().returns(res);
            res.send = sinon.stub().returns();
        
            await createTask(req, res);
        
            expect(res.status.calledWith(201)).to.be.true;
            expect(res.send.calledWith(sinon.match({
                status: true,
                data: sinon.match({
                    title: 'New Task',
                    description: 'Description',
                    assignedMember: 'John Doe',
                    status: 'pending' 
                })
            }))).to.be.true;
        });
        it('should handle validation errors', async function() {
            req.body = { title: '' }; 
            const validatedData = { error: { details: ['Title is required'] } };
    
            sinon.stub(createTaskSchema, 'validate').returns(validatedData);
    
            await createTask(req, res);
    
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({
                status: false,
                errors: validatedData.error.details
            })).to.be.true;
        });
    
        it('should handle save errors', async function() {
            req.body = { title: 'New Task', description: 'Description', assignedMember: 'John Doe' };
            const validatedData = { value: req.body };
            const task = { save: sinon.stub().returns(Promise.reject(new Error('Save Error'))) };
    
            sinon.stub(createTaskSchema, 'validate').returns(validatedData);
            sinon.stub(Task.prototype, 'save').returns(Promise.reject(new Error('Save Error')));
    
            await createTask(req, res);
    
            expect(res.status.calledWith(400)).to.be.true;
            expect(res.send.calledWith({
                status: false,
                errors: sinon.match.instanceOf(Error)
            })).to.be.true;
        });
    });
    

    describe('updateTaskStatus', () => {
        it('should update task status', async () => {
            req.params = { id: 'taskId' };
            req.body = { status: 'complete' };
            const validatedData = { value: req.body };
            sinon.stub(updateTaskSchema, 'validate').returns(validatedData);
            const task = { status: 'incomplete', save: sinon.stub().returns(Promise.resolve()) };
            sinon.stub(Task, 'findById').returns(Promise.resolve(task));

            await updateTaskStatus(req, res);

            expect(task.status).to.equal('complete');
            expect(task.completedAt).to.not.be.undefined;
            expect(res.json.calledWith({
                status: true,
                data: task
            })).to.be.true;

            updateTaskSchema.validate.restore();
            Task.findById.restore();
        });

        it('should handle validation errors', async () => {
            req.body = { status: '' };
            const validatedData = { error: { details: ['Status is required'] } };
            sinon.stub(updateTaskSchema, 'validate').returns(validatedData);

            await updateTaskStatus(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({
                status: false,
                errors: validatedData.error.details
            })).to.be.true;

            updateTaskSchema.validate.restore();
        });

        it('should handle task not found', async () => {
            req.params = { id: 'taskId' };
            req.body = { status: 'complete' };
            const validatedData = { value: req.body };
            sinon.stub(updateTaskSchema, 'validate').returns(validatedData);
            sinon.stub(Task, 'findById').returns(Promise.resolve(null));

            await updateTaskStatus(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.send.calledWith({
                message: 'Task not found'
            })).to.be.true;

            updateTaskSchema.validate.restore();
            Task.findById.restore();
        });

        it('should handle save errors', async () => {
            req.params = { id: 'taskId' };
            req.body = { status: 'complete' };
            const validatedData = { value: req.body };
            sinon.stub(updateTaskSchema, 'validate').returns(validatedData);
            const task = { status: 'incomplete', save: sinon.stub().returns(Promise.reject(new Error('Save Error'))) };
            sinon.stub(Task, 'findById').returns(Promise.resolve(task));

            await updateTaskStatus(req, res);

            expect(res.status.calledWith(400)).to.be.true;
            expect(res.json.calledWith({
                status: false,
                errors: sinon.match.instanceOf(Error)
            })).to.be.true;

            updateTaskSchema.validate.restore();
            Task.findById.restore();
        });
    });

    describe('showTask', () => {
        it('should return a task by ID', async () => {
            req.params = { id: 'taskId' };
            const task = { title: 'Test Task' };
            sinon.stub(Task, 'findById').returns(Promise.resolve(task));

            await showTask(req, res);

            expect(res.status.calledWith(200)).to.be.true;
            expect(res.json.calledWith({
                status: true,
                data: task
            })).to.be.true;

            Task.findById.restore();
        });

        it('should handle task not found', async () => {
            req.params = { id: 'taskId' };
            sinon.stub(Task, 'findById').returns(Promise.resolve(null));

            await showTask(req, res);

            expect(res.status.calledWith(404)).to.be.true;
            expect(res.json.calledWith({
                status: false,
                message: 'Task not found'
            })).to.be.true;

            Task.findById.restore();
        });

        it('should handle errors', async () => {
            req.params = { id: 'taskId' };
            sinon.stub(Task, 'findById').returns(Promise.reject(new Error('Database Error')));

            await showTask(req, res);

            expect(res.status.calledWith(500)).to.be.true;
            expect(res.json.calledWith({
                status: false,
                errors: sinon.match.instanceOf(Error)
            })).to.be.true;

            Task.findById.restore();
        });
    });
});
