import frappe
from frappe import _


@frappe.whitelist(allow_guest=True)
def send(message, user):
    result = {
        'message': message,
        'user': user
    }
    frappe.publish_realtime(event='receive_message',
                            message=result, room='test')


@frappe.whitelist(allow_guest=True)
def get_all(room):
    result = frappe.db.get_all('Chat Message',
                               filters={
                                   'room': room,
                               },
                               fields=['message', 'sender', 'creation'],
                               order_by='creation asc'
                               )
    print(result)
    return result
