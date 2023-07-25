import frappe

@frappe.whitelist()
def get_email():
    return frappe.get_doc('Chat Settings').chatbot_email