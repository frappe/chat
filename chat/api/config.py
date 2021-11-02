import frappe
from frappe import _
from chat.utils import validate_token, get_admin_name, get_chat_settings, get_user_settings
import json


@frappe.whitelist(allow_guest=True)
def settings(token):
    """Fetch and return the settings for a chat session

    Args:
        token (str): Guest token.

    """
    config = {
        'socketio_port': frappe.conf.socketio_port,
        'user_email': frappe.session.user,
        'is_admin': True if 'user_type' in frappe.session.data else False,
        'guest_title': ''.join(frappe.get_hooks('guest_title')),
    }

    config = {**config, **get_chat_settings()}

    if config['is_admin']:
        config['user'] = get_admin_name(config['user_email'])
        config['user_settings'] = get_user_settings()
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


@frappe.whitelist()
def user_settings(settings):
    settings = json.loads(settings)

    if not frappe.db.exists('Chat User Settings', frappe.session.user):
        settings_doc = frappe.get_doc({
            'doctype': 'Chat User Settings',
            'user': frappe.session.user,
            'enable_notifications': settings['enable_notifications'],
            'enable_message_tone': settings['enable_message_tone'],
        }).insert()
    else:
        settings_doc = frappe.get_doc(
            'Chat User Settings', frappe.session.user)

        settings_doc.enable_notifications = settings['enable_notifications']
        settings_doc.enable_message_tone = settings['enable_message_tone']

        settings_doc.save()
