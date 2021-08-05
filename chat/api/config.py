import frappe
from frappe import _
from chat.utils import validate_token, get_admin_name


@frappe.whitelist(allow_guest=True)
def settings(token):
    config = {
        'socketio_port': frappe.conf.socketio_port,
        'user_email': frappe.session.user,
        'is_admin': True if 'user_type' in frappe.session.data else False,
        'guest_title': ''.join(frappe.get_hooks('guest_title')),
    }

    if config['is_admin']:
        config['user'] = get_admin_name(config['user_email'])
    else:
        config['user'] = 'Guest'
        token_verify = validate_token(token)
        if token_verify[0] is True:
            config['room'] = token_verify[1]['room']
            config['user_email'] = token_verify[1]['email']
            config['is_verified'] = True
        else:
            config['is_verified'] = False

    return config
