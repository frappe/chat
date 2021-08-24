import frappe
from frappe import _
from frappe.utils import has_common
import datetime


def time_in_range(start, end, current):
    """Returns whether current is in the range [start, end]"""
    return start <= current <= end


def validate_token(token):
    # Validate the token

    if not token:
        return [False, {}]
    is_exist = frappe.db.exists({
        'doctype': 'Chat Guest',
        'token': token,
    })

    if not is_exist:
        return [False, {}]

    guest_user = frappe.get_doc('Chat Guest', str(is_exist[0][0]))

    if guest_user.ip_address != frappe.local.request_ip:
        return [False, {}]

    existing_room = frappe.db.get_list(
        'Chat Room', filters={'guest': guest_user.email})
    room = existing_room[0]['name']

    guest_details = {
        'email': guest_user.email,
        'room': room,
    }
    return [True, guest_details]


def get_admin_name(user_key):
    full_name = frappe.db.get_value('User', user_key, 'full_name')
    return full_name


def update_room(room, last_message=None, is_read=0, update_modified=True):
    new_values = {
        'is_read': is_read,
    }
    if last_message:
        new_values['last_message'] = last_message

    frappe.db.set_value('Chat Room', room, new_values,
                        update_modified=update_modified)


def get_chat_settings():
    chat_settings = frappe.get_single('Chat Settings')
    user_roles = frappe.get_roles()

    allowed_roles = [u.role for u in chat_settings.roles]
    allowed_roles.extend(['System Manager', 'Administrator', 'Guest'])
    result = {
        'enable_chat': False
    }

    if not chat_settings.enable_chat or not has_common(allowed_roles, user_roles):
        return result

    start_time = datetime.time.fromisoformat(chat_settings.start_time)
    end_time = datetime.time.fromisoformat(chat_settings.end_time)
    current_time = datetime.datetime.now().time()

    chat_status = 'Online' if time_in_range(
        start_time, end_time, current_time) else 'Offline'

    result['enable_chat'] = True
    result['chat_status'] = chat_status
    return result
