import frappe
from frappe import _
import ast


@frappe.whitelist()
def get(email):
    """Get all the rooms for a user 

    Args:
        email (str): Email of user requests all rooms

    """
    data = frappe.db.get_list('Chat Room',
                              order_by='is_read asc, modified desc',
                              or_filters=[
                                  ['members', '=', 'Guest'],
                                  ['members', 'like',
                                   f'%{email}%']
                              ],
                              fields=['name', 'modified',
                                      'last_message', 'is_read', 'room_name', 'members']
                              )
    return data


@frappe.whitelist()
def create_private(room_name, users):
    """Create a new private room

    Args:
        room_name (str): Room name
        users (str): List of users in room
    """
    users = ast.literal_eval(users)
    error_count = 0
    if not room_name:
        frappe.msgprint(
            title='Error',
            msg=_('Room name is required')
        )
        error_count += 1

    if len(users) <= 1:
        frappe.msgprint(
            title='Error',
            msg=_('Please add atleast 1 user')
        )
        error_count += 1

    if error_count:
        return

    members = ', '.join(users)

    room_doc = frappe.get_doc({
        'doctype': 'Chat Room',
        'room_name': room_name,
        'members': members,
    })
    room_doc.insert()
    profile = {
        'room_name': room_name,
        'last_date': room_doc.modified,
        'room': room_doc.name,
        'is_read': 0,
        'room_type': 'Website',
        'members': members,
    }
    frappe.publish_realtime(event='private_room_creation',
                            message=profile, after_commit=True)
