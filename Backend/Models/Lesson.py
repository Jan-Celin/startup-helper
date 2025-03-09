from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from Backend import Base
from datetime import datetime

class LessonCategory(Base):
    __tablename__ = 'lesson_category'

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(200), nullable=False)
    description = Column(String(500))
    slug = Column(String(200), unique=True, nullable=False)
    lessons = relationship("Lesson", backref="category")

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'slug': self.slug,
            'lessons': [lesson.to_dict() for lesson in self.lessons]
        }

class Lesson(Base):
    __tablename__ = 'lesson'

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(200), nullable=False)
    description = Column(String(500))
    slug = Column(String(200), unique=True, nullable=False)
    content_file = Column(String(255))  # Path to the HTML content file
    category_id = Column(Integer, ForeignKey('lesson_category.id'))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'slug': self.slug,
            'category_id': self.category_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }