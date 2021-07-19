import frappe
from frappe import _


@frappe.whitelist(allow_guest=True)
def settings():
    config = {
        'socketio_port': frappe.conf.socketio_port,
        'user': frappe.session.user,
        'is_admin': True if 'user_type' in frappe.session.data else False
    }
    return config
