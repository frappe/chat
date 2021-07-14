import frappe
from frappe import _


@frappe.whitelist(allow_guest=True)
def get():
    result = frappe.db.get_list(
        'Chat Room', fields=['room_name', 'guest', 'last_message'])
    return result
