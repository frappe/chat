# Copyright (c) 2021, codescientist703 and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class ChatMessage(Document):
	
	def on_update(self):
		if self.message_is_for_chatbot():
			frappe.call('chat.api.chatbot.chat', self.sender_email, self.room, self.content)

	def message_is_for_chatbot(self):
		settings = frappe.get_doc('Chatbot Settings')
		chatroom = frappe.get_doc('Chat Room', self.room)
		return settings.enable_chatbot and settings.chatbot_email in chatroom.members and not self.sender_email == settings.chatbot_email
			 

			