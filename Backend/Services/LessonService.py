from Backend.Models.Lesson import Lesson
from Backend.Models.Lesson import LessonCategory
from Backend import db
from Backend.ErrorHandling.Error import Error
from Backend.ErrorHandling.Success import Success
import os
import uuid

class LessonService:
    CONTENT_DIR = 'Backend/Content/lessons'

    @staticmethod
    def get_all_lessons():
        return db.query(Lesson).all()

    @staticmethod
    def get_lesson_by_slug(slug):
        lesson = db.query(Lesson).filter(Lesson.slug == slug).first()
        if not lesson:
            return Error(404, 'Lesson not found')
        
        try:
            content_path = os.path.join('Backend/Content/lessons', lesson.content_file)
            with open(content_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            lesson_dict = lesson.to_dict()
            lesson_dict['content'] = content
            return Success('Lesson found', lesson_dict)
        except Exception as e:
            return Error(500, f'Error reading lesson content: {str(e)}')
    
    @staticmethod
    def ensure_content_directory():
        """Ensure the content directory exists"""
        os.makedirs(LessonService.CONTENT_DIR, exist_ok=True)
    
    @staticmethod
    def generate_content_filename(slug):
        """Generate a unique filename for the lesson content"""
        unique_id = str(uuid.uuid4())[:8]
        return f"{slug}-{unique_id}.html"

    @staticmethod
    def save_content_file(content, filename):
        """Save the lesson content to a file"""
        LessonService.ensure_content_directory()
        file_path = os.path.join(LessonService.CONTENT_DIR, filename)
        
        try:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            return True
        except Exception as e:
            print(f"Error saving content file: {str(e)}")
            return False

    @staticmethod
    def create_lesson(data):
        if 'title' not in data or 'content' not in data:
            return Error(400, 'Title and content are required')

        if 'slug' not in data:
            data['slug'] = data['title'].lower().replace(' ', '-')

        if db.query(Lesson).filter(Lesson.slug == data['slug']).first():
            return Error(400, 'Slug already exists')
        
        filename = LessonService.generate_content_filename(data['slug'])
        if not LessonService.save_content_file(data['content'], filename):
            return Error(500, 'Failed to save lesson content')
        
        lesson = Lesson(
            title=data['title'],
            description=data.get('description', ''),
            slug=data['slug'],
            content_file=filename,
            category_id=data['categoryId']
        )
        
        try:
            db.add(lesson)
            db.commit()
            return Success('Lesson created', lesson.to_dict(), 201)
        except Exception as e:
            os.remove(os.path.join(LessonService.CONTENT_DIR, filename))
            return Error(500, f'Failed to create lesson: {str(e)}')

    @staticmethod
    def update_lesson(slug, data):
        lesson = db.query(Lesson).filter(Lesson.slug == slug).first()
        if not lesson:
            return Error(404, 'Lesson not found')

        if 'content' in data:
            if not lesson.content_file:
                lesson.content_file = LessonService.generate_content_filename(slug)
            
            if not LessonService.save_content_file(data['content'], lesson.content_file):
                return Error(500, 'Failed to update lesson content')

        if 'title' in data:
            lesson.title = data['title']
        if 'description' in data:
            lesson.description = data['description']
        if 'categoryId' in data:
            lesson.category_id = data['categoryId']

        try:
            db.commit()
            return Success('Lesson updated', lesson.to_dict())
        except Exception as e:
            return Error(500, f'Failed to update lesson: {str(e)}')

    @staticmethod
    def delete_lesson(slug):
        lesson = db.query(Lesson).filter(Lesson.slug == slug).first()
        if not lesson:
            return Error(404, 'Lesson not found')

        if lesson.content_file:
            try:
                file_path = os.path.join(LessonService.CONTENT_DIR, lesson.content_file)
                if os.path.exists(file_path):
                    os.remove(file_path)
            except Exception as e:
                return Error(500, f'Failed to delete lesson content file: {str(e)}')

        try:
            db.delete(lesson)
            db.commit()
            return Success('Lesson deleted')
        except Exception as e:
            return Error(500, f'Failed to delete lesson: {str(e)}')
    
    @staticmethod
    def get_all_categories():
        return db.query(LessonCategory).all()

    @staticmethod
    def get_category_by_slug(slug):
        category = db.query(LessonCategory).filter(LessonCategory.slug == slug).first()
        if not category:
            return Error(404, 'Category not found')
        return Success('Category found', category.to_dict())

    @staticmethod
    def create_category(data):
        if 'name' not in data or 'slug' not in data:
            return Error(400, 'Name and slug are required')

        if db.query(LessonCategory).filter(LessonCategory.slug == data['slug']).first():
            return Error(400, 'Slug already exists')
        
        category = LessonCategory(
            name=data['name'],
            description=data.get('description', ''),
            slug=data['slug']
        )
        db.add(category)
        db.commit()
        return Success('Category created', category.to_dict(), 201)

    @staticmethod
    def update_category(slug, data):
        category = db.query(LessonCategory).filter(LessonCategory.slug == slug).first()
        if isinstance(category, Error):
            return category

        if 'slug' in data and data['slug'] != slug:
            if LessonService.get_category_by_slug(data['slug']):
                return Error(400, 'Slug already exists')
            category.slug = data['slug']
        
        print(data)
        if 'name' in data:
            category.name = data['name']
        if 'description' in data:
            category.description = data['description']

        db.commit()
        return Success('Category updated', category.to_dict())

    @staticmethod
    def delete_category(slug):
        category = db.query(LessonCategory).filter(LessonCategory.slug == slug).first()

        if not category:
            return Error(404, 'Category not found')
        
        lessons = db.query(Lesson).filter(Lesson.category_id == category.id).all()
        if lessons:
            return Error(400, 'Category has associated lessons')
        
        db.delete(category)
        db.commit()
        return Success('Category deleted')
    
