// frappe.Chat
// Author - Nihal Mittal <nihal@erpnext.com>

import {
  ChatBubble,
  ChatList,
  ChatSpace,
  ChatForm,
  get_settings,
  setup_dependencies,
  scroll_to_bottom,
} from './components';
frappe.provide('frappe.Chat');

/** Spawns a chat widget on any web page */
frappe.Chat = class {
  constructor() {
    this.setup();
  }

  /** Set up all the required methods for chat widget */
  setup() {
    this.$app_element = $(document.createElement('div'));
    this.$app_element.addClass('chat-app');
    this.$chat_container = $(document.createElement('div'));
    this.$chat_container.addClass('chat-container');
    $('body').append(this.$app_element);
    this.is_open = false;

    this.$chat_element = $(document.createElement('div'))
      .addClass('chat-element')
      .hide();

    this.$chat_element.append(`
			<span class="chat-cross-button">
				${frappe.utils.icon('close', 'lg')}
			</span>
		`);
    this.$chat_element.append(this.$chat_container);
    this.$chat_element.appendTo(this.$app_element);

    this.chat_bubble = new ChatBubble(this);
    this.chat_bubble.render();
    this.setup_app();
  }

  async setup_app() {
    //Loading dependencies and fetch settings

    try {
      const token = localStorage.getItem('guest_token') || '';
      const res = await get_settings(token);

      await setup_dependencies(res.socketio_port);

      if (res.is_admin) {
        // If the user is admin, render everthing
        this.chat_list = new ChatList({
          $wrapper: this.$chat_container,
          user: res.user,
          is_admin: res.is_admin,
        });
        this.chat_list.render();
      } else if (res.is_verified) {
        // If the token and ip address matches, directly render the chat space
        this.chat_space = new ChatSpace({
          $wrapper: this.$chat_container,
          profile: {
            name: res.guest_title,
            room: res.guest.room,
            is_admin: res.is_admin,
            user: res.user,
          },
        });
      } else {
        //Render the form if is user is not verified
        this.chat_form = new ChatForm({
          $wrapper: this.$chat_container,
          profile: {
            name: res.guest_title,
            is_admin: res.is_admin,
          },
        });
        this.chat_form.render();
      }
    } catch (error) {
      console.error(error);
    }
  }

  /** Shows the chat widget */
  show_chat_widget() {
    this.is_open = true;
    this.$chat_element.fadeIn(250);
    if (typeof this.chat_space !== 'undefined') {
      scroll_to_bottom(this.chat_space.$chat_space_container);
    }
  }

  /** Hides the chat widget */
  hide_chat_widget() {
    this.is_open = false;
    this.$chat_element.fadeOut(300);
  }

  setup_events() {}
};

$(function () {
  if (frappe.session.logged_in_user) {
    const frappe_chat = new frappe.Chat();
  }
});
