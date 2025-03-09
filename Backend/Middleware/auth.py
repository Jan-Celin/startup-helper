from functools import wraps
from flask import request, jsonify
from Backend.Services.AuthService import AuthService

def require_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        print(request.headers)
        auth_header = request.headers.get('Authorization')
        print(auth_header)
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Missing or invalid authorization header'}), 401

        token = auth_header.split(' ')[1]
        user = AuthService.verify_token(token)
        if not user:
            return jsonify({'error': 'Invalid or expired token'}), 401

        return f(*args, **kwargs)
    return decorated

def require_admin(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({'error': 'Missing or invalid authorization header'}), 401

        token = auth_header.split(' ')[1]
        user = AuthService.verify_token(token)
        if not user:
            return jsonify({'error': 'Invalid or expired token'}), 401
        
        if not user.is_admin:
            return jsonify({'error': 'Admin access required'}), 403

        return f(*args, **kwargs)
    return decorated