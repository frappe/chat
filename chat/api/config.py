import frappe
from frappe import _


@frappe.whitelist(allow_guest=True)
def settings():
    config = {
        'socketio_port': frappe.conf.socketio_port,
        'user': frappe.session.user,
        'is_admin': True if 'user_type' in frappe.session.data else False,
        'guest_title': ''.join(frappe.get_hooks('guest_title'))
    }
    return config


def validate_token(token, ip_address):
    # Todo
    pass
