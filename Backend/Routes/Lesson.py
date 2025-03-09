from flask import Blueprint, request, jsonify
from Backend.Services.LessonService import LessonService
from sqlalchemy.exc import SQLAlchemyError
from Backend.Middleware.auth import require_auth, require_admin

lesson_blueprint = Blueprint('lesson', __name__, url_prefix='/api')

@lesson_blueprint.route('/categories', methods=['GET'])
def get_categories():
    try:
        categories = LessonService.get_all_categories()
        return jsonify([c.to_dict() for c in categories])
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500

@lesson_blueprint.route('/categories/add', methods=['POST'])
@require_admin
def create_category():
    try:
        response = LessonService.create_category(request.json)
        return response.toJSON(), response.status_code
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500

@lesson_blueprint.route('/categories/<slug>', methods=['GET'])
def get_category(slug):
    try:
        response = LessonService.get_category_by_slug(slug)
        return response.toJSON(), response.status_code
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500

@lesson_blueprint.route('/categories/update/<slug>', methods=['PUT'])
@require_admin
def update_category(slug):
    try:
        response = LessonService.update_category(slug, request.json)
        return response.toJSON(), response.status_code
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500

@lesson_blueprint.route('/categories/delete/<slug>', methods=['DELETE'])
@require_admin
def delete_category(slug):
    try:
        response = LessonService.delete_category(slug)
        return response.toJSON(), response.status_code
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500


@lesson_blueprint.route('/lessons', methods=['GET'])
def get_lessons():
    try:
        lessons = LessonService.get_all_lessons()
        return jsonify([l.to_dict() for l in lessons])
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500

@lesson_blueprint.route('/lessons/add', methods=['POST'])
@require_admin
def create_lesson():
    try:
        response = LessonService.create_lesson(request.json)
        return response.toJSON(), response.status_code
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500

@lesson_blueprint.route('/lessons/<slug>', methods=['GET'])
def get_lesson(slug):
    try:
        response = LessonService.get_lesson_by_slug(slug)
        return response.toJSON(), response.status_code
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500

@lesson_blueprint.route('/lessons/update/<slug>', methods=['PUT'])
@require_admin
def update_lesson(slug):
    try:
        response = LessonService.update_lesson(slug, request.json)
        return response.toJSON(), response.status_code
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500

@lesson_blueprint.route('/lessons/delete/<slug>', methods=['DELETE'])
@require_admin
def delete_lesson(slug):
    try:
        response = LessonService.delete_lesson(slug)
        return response.toJSON(), response.status_code
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500