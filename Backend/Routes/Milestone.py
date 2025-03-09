from flask import Blueprint, request, jsonify
from Backend.Services.MilestoneService import MilestoneService
from Backend.Services.TaskService import TaskService
from sqlalchemy.exc import SQLAlchemyError
from Backend.Middleware.auth import require_auth, require_admin

milestone_blueprint = Blueprint('milestone', __name__, url_prefix='/api')

@milestone_blueprint.route('/milestones/', methods=['GET'])
@require_auth
def get_milestones():
    try:
        milestones = MilestoneService.get_all_milestones()
        return jsonify([m.to_dict() for m in milestones])
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500

@milestone_blueprint.route('/milestones/add', methods=['POST'])
@require_admin
def create_milestone():
    try:
        data = request.json
        response = MilestoneService.create_milestone(data)
        return response.toJSON(), response.status_code
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500

@milestone_blueprint.route('/milestones/update/<int:milestone_id>', methods=['PUT'])
@require_admin
def update_milestone(milestone_id):
    try:
        response = MilestoneService.update_milestone(milestone_id, request.json)
        return response.toJSON(), response.status_code
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500

@milestone_blueprint.route('/milestones/delete/<int:milestone_id>', methods=['DELETE'])
@require_admin
def delete_milestone(milestone_id):
    try:
        response = MilestoneService.delete_milestone(milestone_id)
        return response.toJSON(), response.status_code
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500


@milestone_blueprint.route('/milestones/<int:milestone_id>/tasks/', methods=['GET'])
@require_auth
def get_milestone_tasks(milestone_id):
    try:
        tasks = MilestoneService.get_milestone_tasks(milestone_id)
        return jsonify([task.to_dict() for task in tasks])
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500

@milestone_blueprint.route('/milestones/<int:milestone_id>/tasks/add', methods=['POST'])
@require_admin
def create_task(milestone_id):
    try:
        data = request.json
        response = TaskService.create_task(milestone_id, data)
        return response.toJSON(), response.status_code
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500

@milestone_blueprint.route('/tasks/update/<int:task_id>', methods=['PUT'])
@require_auth
def update_task(task_id):
    try:
        response = TaskService.update_task(task_id, request.json)
        return response.toJSON(), response.status_code
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500

@milestone_blueprint.route('/tasks/delete/<int:task_id>', methods=['DELETE'])
@require_admin
def delete_task(task_id):
    try:
        response = TaskService.delete_task(task_id)
        return response.toJSON(), response.status_code
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500
