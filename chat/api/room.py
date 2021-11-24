import frappe
from frappe import _
from chat.utils import get_full_name
import ast


@frappe.whitelist()
def get(email):
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

    for room in all_rooms:
        if room['type'] == 'Direct':
            members = room['members'].split(', ')
            room['room_name'] = get_full_name(
                members[0]) if email == members[1] else get_full_name(members[1])
            room['opposite_person_email'] = members[0] if members[1] == email else members[1]
        room['is_read'] = 1 if email in room['is_read'] else 0

    all_rooms.sort(key=lambda room: comparator(room))
    return all_rooms


@frappe.whitelist()
def create_private(room_name, users, type):
    """Create a new private room

    Args:
        room_name (str): Room name
        users (str): List of users in room
    """
    users = ast.literal_eval(users)
    users.append(frappe.session.user)
    members = ', '.join(users)

    if type == 'Direct':
        room_doctype = frappe.qb.DocType('Chat Room')
        query = (
            frappe.qb.from_(room_doctype)
            .select('name')
            .where(room_doctype.type == 'Direct')
            .where(room_doctype.members.like(f'%{users[0]}%'))
            .where(room_doctype.members.like(f'%{users[1]}%'))
        ).run(as_dict=True)
        if query:
            frappe.throw(
                title='Error',
                msg=_('Direct Room already exists!')
            )
        else:
            room_doc = get_private_room_doc(room_name, members, type)
            room_doc.insert()
    else:
        room_doc = get_private_room_doc(room_name, members, type)
        room_doc.insert()

    profile = {
        'room_name': room_name,
        'last_date': room_doc.modified,
        'room': room_doc.name,
        'is_read': 0,
        'room_type': type,
        'members': members,
    }

    if type == 'Direct':
        members_names = [
            {
                'name': get_full_name(users[0]),
                'email': users[0]
            },
            {
                'name': get_full_name(users[1]),
                'email': users[1]
            }
        ]
        profile['member_names'] = members_names

    frappe.publish_realtime(event='private_room_creation',
                            message=profile, after_commit=True)


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
