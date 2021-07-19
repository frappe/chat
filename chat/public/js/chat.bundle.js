// frappe.Chat
// Author - Nihal Mittal <nihal@erpnext.com>

import {
	ChatBubble,
	ChatList,
	ChatSpace,
	get_settings,
	setup_dependencies,
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
		this.$chat_container.addClass('chat-container').hide();
		$('body').append(this.$app_element);
		this.is_open = false;
		this.chat_bubble = new ChatBubble(this);
		this.$chat_container.appendTo(this.$app_element);
		this.setup_app();
	}

	async setup_app() {
		try {
			const res = await get_settings();
			await setup_dependencies(res.socketio_port);
			if (res.is_admin) {
				this.chat_list = new ChatList({
					$wrapper: this.$chat_container,
					user: res.user,
					is_admin: res.is_admin,
				});
				this.chat_list.render();
			} else {
				this.chat_space = new ChatSpace({
					$wrapper: this.$chat_container,
					profile: {
						name: 'Frappe',
						is_admin: res.is_admin,
						room: 'CR00001',
						user: res.user,
					},
				});
			}
		} catch (error) {
			console.table(error);
		}
	}
	/** Shows the chat widget */
	show_chat_widget() {
		this.is_open = true;
		this.$chat_container.fadeIn(250);
	}

	/** Hides the chat widget */
	hide_chat_widget() {
		this.is_open = false;
		this.$chat_container.fadeOut(300);
	}

	setup_events() {}
};

$(function () {
	if (frappe.session.logged_in_user) {
		const ha = new frappe.Chat();
	}
});
