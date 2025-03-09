from Backend.Models.Milestone import Milestone, Task
from Backend import db
from flask import jsonify
from sqlalchemy.exc import SQLAlchemyError
from Backend.ErrorHandling.Error import Error
from Backend.ErrorHandling.Success import Success

class MilestoneService:
    @staticmethod
    def get_all_milestones():
        return db.query(Milestone).all()

    @staticmethod
    def create_milestone(data):
        if 'name' not in data:
            return Error(400, 'Name is required')

        if MilestoneService.get_milestone_by_name(data['name']):
            return Error(400, 'Name already exists')
        
        milestone = Milestone(
            name=data['name'],
            description=data['description']
            )
        db.add(milestone)
        db.commit()
        return Success('Milestone created', milestone.to_dict(), 201)

    @staticmethod
    def get_milestone_by_id(milestone_id):
        return db.query(Milestone).get(milestone_id)

    @staticmethod
    def get_milestone_by_name(name):
        return db.query(Milestone).filter(Milestone.name == name).first()

    @staticmethod
    def update_milestone(milestone_id, data):
        milestone = MilestoneService.get_milestone_by_id(milestone_id)
        if 'name' in data:
            if MilestoneService.get_milestone_by_name(data['name']):
                return Error(400, 'Name already exists')
            milestone.name = data['name']

        if 'description' in data:
            milestone.description = data['description']

        db.commit()
        return Success('Milestone updated', milestone.to_dict())

    @staticmethod
    def delete_milestone(milestone_id):
        milestone = MilestoneService.get_milestone_by_id(milestone_id)
        db.delete(milestone)
        db.commit()
        return Success('Milestone deleted')

    @staticmethod
    def get_milestone_tasks(milestone_id):
        milestone = MilestoneService.get_milestone_by_id(milestone_id)
        return milestone.tasks