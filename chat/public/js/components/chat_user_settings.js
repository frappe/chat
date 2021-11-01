import { set_user_settings } from './chat_utils';

export default class ChatUserSettings {
  constructor() {
    this.setup();
  }

  async setup() {
    this.user_settings_dialog = new frappe.ui.Dialog({
      title: __('My Settings'),
      fields: [
        {
          label: __('Enable Message Tone'),
          fieldname: 'enable_message_tone',
          fieldtype: 'Check',
          default: frappe.Chat.settings.user.enable_message_tone,
        },
        {
          label: __('Enable Notifications'),
          fieldname: 'enable_notifications',
          fieldtype: 'Check',
          default: frappe.Chat.settings.user.enable_notifications,
        },
      ],
      action: {
        primary: {
          label: __('Save'),
          onsubmit: (values) => {
            set_user_settings(values);
            frappe.Chat.settings.user.enable_message_tone =
              values.enable_message_tone;
            frappe.Chat.settings.user.enable_notifications =
              values.enable_notifications;

            this.user_settings_dialog.hide();
          },
        },
      },
    });
  }

  show() {
    this.user_settings_dialog.show();
  }
}
