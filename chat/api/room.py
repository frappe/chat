import frappe
from frappe import _


@frappe.whitelist(allow_guest=True)
def get(email):
    """Get all the rooms for a user from

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
