from Backend.ErrorHandling.BaseResponse import BaseResponse

class Success(BaseResponse):
    def __init__(self, message='', data='', status_code=200):
        self.message = message
        self.data = data
        self.status_code = status_code

    def to_dict(self):
        return {
            "message": self.message,
            "data": self.data,
            "status_code": self.status_code
        }