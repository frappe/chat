import { create_private_room } from './chat_utils';

export default class ChatAddRoom {
  constructor(opts) {
    this.user = opts.user;
    this.users_list = [...frappe.user.get_emails(), 'Administrator'];
    this.user_email = opts.user_email;
    this.users_list = this.users_list.filter(function (user) {
      return user != opts.user_email;
    });
    this.setup();
  }

  async setup() {
    this.add_room_dialog = new frappe.ui.Dialog({
      title: __('New Chat Room'),
      fields: [
        {
          label: __('Room Type'),
          fieldname: 'type',
          fieldtype: 'Select',
          options: ['Group', 'Direct'],
          default: 'Group',
          onchange: () => {
            const type = this.add_room_dialog.get_value('type');
            const is_group = type === 'Group';
            this.add_room_dialog.set_df_property('room_name', 'reqd', is_group);
            this.add_room_dialog.set_df_property('users', 'reqd', is_group);
            this.add_room_dialog.set_df_property('user', 'reqd', !is_group);
          },
          reqd: true,
        },
        {
          label: __('Room Name'),
          fieldname: 'room_name',
          fieldtype: 'Data',
          depends_on: "eval:doc.type == 'Group'",
          reqd: true,
        },
        {
          label: __('Users'),
          fieldname: 'users',
          fieldtype: 'MultiSelectPills',
          options: this.users_list,
          depends_on: "eval:doc.type == 'Group'",
          reqd: true,
        },
        {
          label: __('User'),
          fieldname: 'user',
          fieldtype: 'Link',
          options: 'User',
          depends_on: "eval:doc.type == 'Direct'",
        },
      ],
      action: {
        primary: {
          label: __('Create'),
          onsubmit: (values) => {
            let users = this.add_room_dialog.fields_dict.users.get_values();
            let room_name = values.room_name;
            if (values.type === 'Direct') {
              users = [values.user];
              room_name = 'Direct Room';
            }
            this.handle_room_creation(room_name, users, values.type);
            this.add_room_dialog.hide();
          },
        },
      },
    });
  }

  show() {
    this.add_room_dialog.show();
  }

  async handle_room_creation(room_name, users, type) {
    try {
      await create_private_room(room_name, users, type);
      this.add_room_dialog.clear();
    } catch (error) {
      //pass
    }
  }
}
