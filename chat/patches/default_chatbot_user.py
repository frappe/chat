import frappe

def create_default_chatbot_user():
    chatbot_user = frappe.new_doc('User')
    chatbot_user.email = 'Chatbot'
    chatbot_user.first_name = 'Chatbot'
    chatbot_user.insert()

def delete_default_chatbot_user():
    frappe.delete_doc('User','Chatbot')