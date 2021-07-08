import { ChatBubble, ChatList } from './components';
frappe.provide('frappe.Chat');

frappe.Chat = class {
	constructor() {
		this.setup();
	}
	setup() {
		this.$app_element = $(document.createElement('div'));
		this.$app_element.addClass('chat-app');
		this.$chat_container = $(document.createElement('div'));
		this.$chat_container.addClass('chat-container').hide();
		$('body').append(this.$app_element);
		this.is_open = false;
		this.chat_bubble = new ChatBubble(this);
		this.$chat_container.appendTo(this.$app_element);
		this.chat_list = new ChatList(this);
		this.chat_list.render();
		await this.setup_dependencies();
	}
	async setup_dependencies() {
		await frappe.require(
			[
				'assets/frappe/js/lib/socket.io.min.js',
				'assets/frappe/js/frappe/socketio_client.js',
			],
			() => {
				frappe.socketio.init(9000);
			}
		);
	}
	show_chat_widget() {
		this.is_open = true;
		this.$chat_container.fadeIn(250);
	}
	hide_chat_widget() {
		this.is_open = false;
		this.$chat_container.fadeOut(300);
	}
	setup_events() {}
};
