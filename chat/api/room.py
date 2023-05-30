import frappe
from frappe import _
from chat.utils import get_full_name
import ast
from typing import List, Dict


@frappe.whitelist()
def get(email: str) -> List[Dict]:
    """Get all the rooms for a user

    Args:
        email (str): Email of user requests all rooms

    """
    room_doctype = frappe.qb.DocType('Chat Room')

    all_rooms = (
        frappe.qb.from_(room_doctype)
        .select('name', 'modified', 'last_message', 'is_read', 'room_name', 'members', 'type')
        .where((room_doctype.type.like('Guest') | room_doctype.members.like(f'%{email}%')))

    ).run(as_dict=True)

    user_rooms = []

    for room in all_rooms:
        if room['type'] == 'Direct':
            members = room['members'].split(', ')
            room['room_name'] = get_full_name(
                members[0]) if email == members[1] else get_full_name(members[1])
            room['opposite_person_email'] = members[0] if members[1] == email else members[1]
        if room['type'] == 'Guest':
            users = frappe.get_cached_doc("Chat Room", room['name']).users
            if not users:
                users = frappe.get_cached_doc('Chat Settings').chat_operators
            if email not in [u.user for u in users]:
                continue
        room['is_read'] = 1 if room['is_read'] and email in room['is_read'] else 0
        user_rooms.append(room)

    user_rooms.sort(key=lambda room: comparator(room))
    return user_rooms


@frappe.whitelist()
def create_private(room_name, users, type):
    """Create a new private room

    Args:
        room_name (str): Room name
        users (str): List of users in room
    """
    users = ast.literal_eval(users)
    users.append(frappe.session.user)
    members = ", ".join(users)

    if type == "Direct":
        room_doctype = frappe.qb.DocType("Chat Room")
        direct_room_exists = (
            frappe.qb.from_(room_doctype)
            .select("name")
            .where(room_doctype.type == "Direct")
            .where(room_doctype.members.like(f"%{users[0]}%"))
            .where(room_doctype.members.like(f"%{users[1]}%"))
        ).run(as_dict=True)
        if direct_room_exists:
            frappe.throw(title="Error", msg=_("Direct Room already exists!"))

    room_doc = get_private_room_doc(room_name, members, type).insert(ignore_permissions=True)

    profile = {
        "room_name": room_name,
        "last_date": room_doc.modified,
        "room": room_doc.name,
        "is_read": 0,
        "room_type": type,
        "members": members,
    }

    if type == "Direct":
        profile["member_names"] = [
            {"name": get_full_name(u), "email": u} for u in users
        ]

    for user in users:
        frappe.publish_realtime(
            event="private_room_creation", message=profile, user=user, after_commit=True
        )


def get_private_room_doc(room_name, members, type):
    return frappe.get_doc({
        'doctype': 'Chat Room',
        'room_name': room_name,
        'members': members,
        'type': type,
    })


def comparator(key):
    return (
        key.is_read,
        reversor(key.modified)
    )


class reversor:
    def __init__(self, obj):
        self.obj = obj

    def __eq__(self, other):
        return other.obj == self.obj

    def __gt__(self, other):
        return other.obj > self.obj
