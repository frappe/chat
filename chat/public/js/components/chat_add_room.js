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
          label: __('Room Name'),
          fieldname: 'room_name',
          fieldtype: 'Data',
          reqd: true,
        },
        {
          label: __('Users'),
          fieldname: 'users',
          fieldtype: 'MultiSelectPills',
          options: this.users_list,
          reqd: true,
        },
      ],
      action: {
        primary: {
          label: __('Create'),
          onsubmit: (values) => {
            let users = this.add_room_dialog.fields_dict.users.get_values();
            users = [...users, this.user_email];
            this.handle_room_creation(values.room_name, users);
            this.add_room_dialog.hide();
          },
        },
      },
    });
  }

  show() {
    this.add_room_dialog.show();
  }

  async handle_room_creation(room_name, users) {
    try {
      await create_private_room(room_name, users);
      this.add_room_dialog.clear();
    } catch (error) {
      //pass
    }
  }
}
