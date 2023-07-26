import frappe

@frappe.whitelist()
def get_email():
    return frappe.get_doc('Chat Settings').chatbot_email

@frappe.whitelist()
def chat(sender_email, room, content):
    chat_settings = frappe.get_doc('Chat Settings')
    frappe.call('chat.api.message.set_typing', room, chat_settings.chatbot_email, True, False)
    try :
        if chat_settings.chatbot_action:
            answer = frappe.call(chat_settings.chatbot_action, sender_email, room, content)
        else :
            answer = 'Chatbot isn\'t linked to any method'
    except:
        answer = 'Something went wrong, try again later'
    finally:
        frappe.call('chat.api.message.set_typing', room, chat_settings.chatbot_email, False, False)
        frappe.call('chat.api.message.send', answer, chat_settings.chatbot_email, room, chat_settings.chatbot_email)
