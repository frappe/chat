import frappe
from frappe import _
from chat.utils import update_room


@frappe.whitelist(allow_guest=True)
def send(message, user, room):
    new_message = frappe.get_doc({
        'doctype': 'Chat Message',
        'message': message,
        'sender': user,
        'room': room,
    }).insert()
    update_room(room=room, last_message=message)

    result = {
        'message': message,
        'user': user,
        'creation': new_message.creation,
    }

    latest_update_data = {
        'room': room,
        'message': message,
        'creation': new_message.creation
    }

    frappe.publish_realtime(event=room, message=result, after_commit=True)

    frappe.publish_realtime(event='latest_chat_updates',
                            message=latest_update_data, after_commit=True)


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


@frappe.whitelist()
def mark_as_read(room):
    frappe.enqueue('chat.utils.update_room', room=room,
                   is_read=1, update_modified=False)
