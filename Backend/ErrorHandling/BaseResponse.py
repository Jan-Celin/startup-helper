import json

class BaseResponse:
    def __init__(self, status_code, message):
        self.message = message
        self.status_code = status_code

    def toJSON(self):
        return json.dumps(
            self,
            default=lambda o: o.__dict__, 
            sort_keys=True,
            indent=4)
    
    def to_dict(self):
        return {
            "message": self.message,
            "status_code": self.status_code
        }