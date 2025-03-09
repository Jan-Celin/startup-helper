from flask import Blueprint, request, jsonify
from Backend.Services.AuthService import AuthService
from sqlalchemy.exc import SQLAlchemyError

auth_blueprint = Blueprint('auth', __name__, url_prefix='/api/auth')

@auth_blueprint.route('/register', methods=['POST'])
def register():
    try:
        response = AuthService.register_user(request.json)
        return response.toJSON(), response.status_code
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500

@auth_blueprint.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        if not all(k in data for k in ('email', 'password')):
            return jsonify({'error': 'Email and password are required'}), 400
        
        response = AuthService.login(data['email'], data['password'])
        return response.toJSON(), response.status_code
    except SQLAlchemyError as e:
        return jsonify({'error': str(e)}), 500