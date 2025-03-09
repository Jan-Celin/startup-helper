from Backend.Models.Milestone import Task
from Backend import db
from flask import jsonify
from Backend.ErrorHandling.Error import Error
from Backend.ErrorHandling.Success import Success

class TaskService:
    @staticmethod
    def create_task(milestone_id, data):
        if 'name' not in data:
            return Error(400, 'Name is required')

        if TaskService.get_task_by_name(data['name']):
            return Error(400, 'Name already exists')
        
        task = Task(
            name=data['name'],
            description=data.get('description', ''),
            milestone_id=milestone_id,
            completed=data.get('completed', False),
            comment=data.get('comment', '')
        )
        db.add(task)
        db.commit()
        return Success('Task created', task.to_dict(), 201)

    @staticmethod
    def get_task_by_id(task_id):
        return db.query(Task).get(task_id)
    
    @staticmethod
    def get_task_by_name(name):
        return db.query(Task).filter(Task.name == name).first()

    @staticmethod
    def update_task(task_id, data):
        task = TaskService.get_task_by_id(task_id)
        if 'name' in data:
            if TaskService.get_task_by_name(data['name']):
                return Error(400, 'Name already exists')
            task.name = data['name']

        if 'description' in data:
            task.description = data['description']

        if 'completed' in data:
            task.completed = data['completed']

        if 'comment' in data:
            task.comment = data['comment']

        db.commit()
        return Success('Task updated', task.to_dict())

    @staticmethod
    def delete_task(task_id):
        task = TaskService.get_task_by_id(task_id)
        db.delete(task)
        db.commit()
        return Success('Task deleted')
