// frappe.Chat
// Author - Nihal Mittal <nihal@erpnext.com>

import {
  ChatBubble,
  ChatList,
  ChatSpace,
  ChatWelcome,
  get_settings,
  scroll_to_bottom,
} from './components';
frappe.provide('frappe.Chat');
frappe.provide('frappe.Chat.settings');

/** Spawns a chat widget on any web page */
frappe.Chat = class {
  constructor() {
    this.setup_app();
  }

  /** Create all the required elements for chat widget */
  create_app() {
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

    const navbar_icon_html = `
        <li class='nav-item dropdown dropdown-notifications 
          dropdown-mobile chat-navbar-icon' title="Show Chats" >
          ${frappe.utils.icon('small-message', 'md')}
          <span class="badge" id="chat-notification-count"></span>
        </li>
    `;

    if (this.is_desk === true) {
      $('header.navbar > .container > .navbar-collapse > ul').prepend(
        navbar_icon_html
      );
    }
    this.setup_events();
  }

  /** Load dependencies and fetch the settings */
  async setup_app() {
    try {
      const token = localStorage.getItem('guest_token') || '';
      const res = await get_settings(token);
      this.is_admin = res.is_admin;
      this.is_desk = 'desk' in frappe;

      if (res.enable_chat === false || (!this.is_desk && this.is_admin)) {
        return;
      }

      this.create_app();
      await frappe.socketio.init(res.socketio_port);

      frappe.Chat.settings = {};
      frappe.Chat.settings.user = res.user_settings;
      frappe.Chat.settings.unread_count = 0;

      if (res.is_admin) {
        // If the user is admin, render everthing
        this.chat_list = new ChatList({
          $wrapper: this.$chat_container,
          user: res.user,
          user_email: res.user_email,
          is_admin: res.is_admin,
        });
        this.chat_list.render();
      } else if (res.is_verified) {
        // If the token and ip address matches, directly render the chat space
        this.chat_space = new ChatSpace({
          $wrapper: this.$chat_container,
          profile: {
            room_name: res.guest_title,
            room: res.room,
            is_admin: res.is_admin,
            user: res.user,
            user_email: res.user_email,
          },
        });
      } else {
        //Render the welcome screen if the user is not verified
        this.chat_welcome = new ChatWelcome({
          $wrapper: this.$chat_container,
          profile: {
            name: res.guest_title,
            is_admin: res.is_admin,
            chat_status: res.chat_status,
          },
        });
        this.chat_welcome.render();
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

  should_close(e) {
    const chat_app = $('.chat-app');
    const navbar = $('.navbar');
    const modal = $('.modal');
    return (
      !chat_app.is(e.target) &&
      chat_app.has(e.target).length === 0 &&
      !navbar.is(e.target) &&
      navbar.has(e.target).length === 0 &&
      !modal.is(e.target) &&
      modal.has(e.target).length === 0
    );
  }

  setup_events() {
    const me = this;
    $('.chat-navbar-icon').on('click', function () {
      me.chat_bubble.change_bubble();
    });

    $(document).mouseup(function (e) {
      if (me.should_close(e) && me.is_open === true) {
        me.chat_bubble.change_bubble();
      }
    });
  }
};

$(function () {
  new frappe.Chat();
});
