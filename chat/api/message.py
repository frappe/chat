import frappe
from frappe import _


@frappe.whitelist(allow_guest=True)
def send(message, user, room):
    new_message = frappe.get_doc({
        'doctype': 'Chat Message',
        'message': message,
        'sender': user,
        'room': room,
    }).insert()
    doc_room = frappe.get_doc('Chat Room', room)
    doc_room.last_message = message
    doc_room.save()
    result = {
        'message': message,
        'user': user,
        'creation': new_message.creation,
    }
    frappe.publish_realtime(event='receive_message',
                            message=result, room=room, user='Guest')


@frappe.whitelist(allow_guest=True)
def get_all(room):
    result = frappe.db.get_all('Chat Message',
                               filters={
                                   'room': room,
                               },
                               fields=['message', 'sender', 'creation'],
                               order_by='creation asc'
                               )
    return result
