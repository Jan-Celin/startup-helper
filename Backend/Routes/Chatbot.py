from flask import Blueprint, request, jsonify
from Backend.Services.ChatbotService import ChatbotService

chatbot_blueprint = Blueprint('chatbot', __name__, url_prefix='/api/chatbot')
chatbot_service = ChatbotService()

chatbot_service.train('data/chatbot.json')

@chatbot_blueprint.route('/message', methods=['POST'])
def send_message():
    data = request.json
    try:
        response = chatbot_service.get_response(data)
        return response.toJSON(), response.status_code
    except Exception as e:
        return jsonify({'error': str(e)}), 500
