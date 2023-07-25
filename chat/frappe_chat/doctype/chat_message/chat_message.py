# Copyright (c) 2021, codescientist703 and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class ChatMessage(Document):
	def on_update(self):
		chat_settings = frappe.get_doc('Chat Settings')
		chatroom = frappe.get_doc('Chat Room', self.room)	

		if chat_settings.enable_chatbot and chat_settings.chatbot_email in chatroom.members and not self.sender_email == chat_settings.chatbot_email:
			frappe.call('chat.api.message.set_typing', self.room, chat_settings.chatbot_email, True, False)

			try :
				if chat_settings.chatbot_action:
					answer = frappe.call(chat_settings.chatbot_action, self.sender_email, self.room, self.content)
				else :
					answer = 'Chatbot isn\'t linked to any method'
			except:
				answer = 'Something went wrong, try again later'
			finally:
				frappe.call('chat.api.message.set_typing', self.room, chat_settings.chatbot_email, False, False)
				frappe.call('chat.api.message.send', answer, chat_settings.chatbot_email, self.room, chat_settings.chatbot_email)
			

			
