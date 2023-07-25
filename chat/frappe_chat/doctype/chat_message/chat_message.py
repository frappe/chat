# Copyright (c) 2021, codescientist703 and contributors
# For license information, please see license.txt


import frappe
from frappe.model.document import Document

class ChatMessage(Document):
	def on_update(self):
		chatbot_user = frappe.get_doc('User',{'email':'chatbot@example.com'})
		if not self.sender == chatbot_user.first_name:
			answer = "No" if len(self.content) > 5 else "Yes"
			frappe.call('chat.api.message.send', answer, chatbot_user.first_name, self.room, chatbot_user.email)
