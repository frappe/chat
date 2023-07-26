# Copyright (c) 2021, codescientist703 and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class ChatMessage(Document):
	
	def on_update(self):
		if self.message_is_for_chatbot():
			frappe.call('chat.api.chatbot.chat', self.sender_email, self.room, self.content)

	def message_is_for_chatbot(self):
		chat_settings = frappe.get_doc('Chat Settings')
		chatroom = frappe.get_doc('Chat Room', self.room)
		return chat_settings.enable_chatbot and chat_settings.chatbot_email in chatroom.members and not self.sender_email == chat_settings.chatbot_email
			 

			