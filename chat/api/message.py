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
