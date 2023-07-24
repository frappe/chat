# Copyright (c) 2021, codescientist703 and contributors
# For license information, please see license.txt


import frappe
from frappe.model.document import Document

class ChatMessage(Document):
	def on_update(self):
		if not self.sender == 'AI':
			content = "No" if len(self.content) == 5 else "Yes"
			frappe.call('chat.api.message.send',content,'AI',self.room, 'ai@help.ai')
