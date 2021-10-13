import frappe
from frappe import _
from frappe.utils import validate_email_address


@frappe.whitelist(allow_guest=True)
def validate_guest(email, full_name, message):
    """Validate the guest user

    Args:
        email (str): Email of guest.
        full_name (str): Full name of guest.
        message (str): Message to be dropped.

    """
    if not validate_email_address(email):
        frappe.throw(
            title='Error',
            msg=_('Invalid email address')
        )
    if not full_name:
        frappe.throw(
            title='Error',
            msg=_('Full Name is required')
        )
    if not message:
        frappe.throw(
            title='Error',
            msg=_('Message is too short')
        )

    if not frappe.db.exists('Chat Profile', email):
        profile_doc = frappe.get_doc({
            'doctype': 'Chat Profile',
            'email': email,
            'guest_name': full_name,
        }).insert()
        new_room = frappe.get_doc({
            'doctype': 'Chat Room',
            'guest': email,
            'room_name': full_name,
            'members': 'Guest',
            'type': 'Guest'
        }).insert()
        room = new_room.name

        # New room will be created on client side
        profile = {
            'room_name': full_name,
            'last_message': message,
            'last_date': new_room.modified,
            'room': room,
            'is_read': 0,
            'room_type': 'Guest'
        }
        token = profile_doc.token
        frappe.publish_realtime(event='new_room_creation',
                                message=profile, after_commit=True)

    else:
        token = frappe.get_doc('Chat Profile', email).token
        room = frappe.db.get_value('Chat Room', {'guest': email}, 'name')

    result = {
        'email': email,
        'guest_name': 'Guest',
        'message': message,
        'room': room,
        'room_name': full_name,
        'room_type': 'Guest',
        'token': token
    }
    return result
