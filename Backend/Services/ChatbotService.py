from chatterbot import ChatBot
from chatterbot.trainers import ListTrainer
from Backend.Config import Config
from Backend.ErrorHandling.Error import Error
from Backend.ErrorHandling.Success import Success
import json
import os.path

class ChatbotService:
    def __init__(self):
        self.chatbot = ChatBot(
            Config.CHATBOT_NAME,
            logic_adapters=[{
                'import_path': 'chatterbot.logic.BestMatch',
                'default_response': Config.CHATBOT_DEFAULT_RESPONSE,
                'maximum_similarity_threshold': Config.CHATBOT_THRESHOLD,
            }]
        )
        self.trainer = ListTrainer(self.chatbot)
    
    def train(self, data):
        # Data is a json file with the following format:
        # {
        #     "conversations": [
        #         ["Hi", "Hello"],
        #         ["How are you?", "I'm fine, thank you"]
        #     ]
        # }

        print('Training chatbot...')
        try:
            print(data)
            print(os.path.exists(data))
            with open(data, 'r', encoding='utf-8') as file:
                conversations = json.load(file).get('conversations')
                for conversation in conversations:
                    self.trainer.train(conversation)
        except Exception as e:
            print(e)
            return Error(500, str(e))
        print('Chatbot trained successfully')
    
    def get_response(self, data):
        message = data.get('message')
        if not message:
            return Error(400, 'Message is required')
        
        return Success('Response', self.chatbot.get_response(message).text)
