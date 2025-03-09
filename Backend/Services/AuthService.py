from Backend.Models.User import User
from Backend import db
from Backend.ErrorHandling.Error import Error
from Backend.ErrorHandling.Success import Success
from datetime import datetime, timedelta
import jwt
import os

class AuthService:
    SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'default-secret-key')

    @staticmethod
    def register_user(data):
        if not all(k in data for k in ('email', 'password')):
            return Error(400, 'Email adresa i zaporka su obavetni')

        if db.query(User).filter(User.email == data['email']).first():
            return Error(400, 'Email adresa je već registrirana')
        
        if len(data['password']) < 8:
            return Error(400, 'Zaporka mora imati barem 8 znakova')
        if not any(c.isupper() for c in data['password']):
            return Error(400, 'Zaporka mora sadržavati barem jedno veliko slovo')
        if not any(c.isdigit() for c in data['password']):
            return Error(400, 'Zaporka mora sadržavati barem jednu znamenku')
        if not any(c in '!@#$%^&*()-_=+[]{}|;:,.<>?/~`' for c in data['password']):
            return Error(400, 'Zaporka mora sadržavati barem jedan specijalni znak')

        user = User(
            email=data['email'],
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            is_admin=False
        )
        user.set_password(data['password'])

        db.add(user)
        db.commit()
        return Success('Korisnik uspješno registriran', user.to_dict(), 201)

    @staticmethod
    def login(email, password):
        user = db.query(User).filter(User.email == email).first()
        if not user or not user.check_password(password):
            return Error(401, 'Neispravna email adresa ili zaporka')

        user.last_login = datetime.now()
        db.commit()

        token = jwt.encode({
            'user_id': user.id,
            'is_admin': user.is_admin,
            'exp': datetime.now() + timedelta(days=1)
        }, AuthService.SECRET_KEY, algorithm='HS256')

        return Success('Login successful', {
            'token': token,
            'user': user.to_dict()
        })

    @staticmethod
    def verify_token(token):
        try:
            payload = jwt.decode(token, AuthService.SECRET_KEY, algorithms=['HS256'])
            user = db.query(User).get(payload['user_id'])
            if not user:
                return None
            return user
        except jwt.ExpiredSignatureError:
            return None
        except jwt.InvalidTokenError:
            return None