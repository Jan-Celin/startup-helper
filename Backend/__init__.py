from flask import Flask
from flask_cors import CORS
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy.ext.declarative import declarative_base
from Backend.Config import Config
import os

Base = declarative_base()

data_path = os.path.dirname(Config.DATABASE_URI.replace('sqlite:///', ''))
os.makedirs(data_path, exist_ok=True)

engine = create_engine(Config.DATABASE_URI)

db = scoped_session(sessionmaker(bind=engine))

def create_app():
    app = Flask(__name__)
    
    app.config['SQLALCHEMY_DATABASE_URI'] = Config.DATABASE_URI
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    CORS(app)

    print("Importing models...")
    from Backend.Models.Milestone import Milestone, Task
    from Backend.Models.Lesson import Lesson, LessonCategory
    from Backend.Models.User import User

    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print(f"Created tables: {tables}")

    print("Registering blueprints...")
    from Backend.Routes.Chatbot import chatbot_blueprint
    from Backend.Routes.Milestone import milestone_blueprint
    from Backend.Routes.Lesson import lesson_blueprint
    from Backend.Routes.Authentication import auth_blueprint

    app.register_blueprint(chatbot_blueprint)
    app.register_blueprint(milestone_blueprint)
    app.register_blueprint(lesson_blueprint)
    app.register_blueprint(auth_blueprint)


    admin_user = db.query(User).filter(User.email == 'admin@admin.com').first()
    if admin_user:
        db.delete(admin_user)
        db.commit()
        
    user = User(
        email='admin@admin.com',
        first_name='Admin',
        last_name='Admin',
        is_admin=True
    )
    user.set_password('admin')

    db.add(user)
    db.commit()


    @app.teardown_appcontext
    def shutdown_session(exception=None):
        db.remove()

    return app