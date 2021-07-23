import frappe
from frappe import _
from chat.utils import validate_token


@frappe.whitelist(allow_guest=True)
def settings(token):
    config = {
        'socketio_port': frappe.conf.socketio_port,
        'user': frappe.session.user,
        'is_admin': True if 'user_type' in frappe.session.data else False,
        'guest_title': ''.join(frappe.get_hooks('guest_title')),
    }
    token_verify = validate_token(token)
    if token_verify[0] is True:
        config['guest'] = token_verify[1]
        config['is_verified'] = True
    else:
        config['is_verified'] = False

    return config
