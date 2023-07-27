import frappe

@frappe.whitelist()
def is_enabled():
    return frappe.get_doc('Chatbot Settings').enable_chatbot

@frappe.whitelist()
def get_email():
    return frappe.get_doc('Chat Settings').chatbot_email

@frappe.whitelist()
def chat(sender_email, room, content):
    settings = frappe.get_doc('Chatbot Settings')
    frappe.call('chat.api.message.set_typing', room, settings.chatbot_email, True, False)

    if settings.chatbot_action:
        answer = frappe.call(settings.chatbot_action, sender_email, room, content)
    else :
        answer = 'Chatbot isn\'t linked to any method'

    frappe.call('chat.api.message.set_typing', room, settings.chatbot_email, False, False)
    frappe.call('chat.api.message.send', answer, settings.chatbot_email, room, settings.chatbot_email)
