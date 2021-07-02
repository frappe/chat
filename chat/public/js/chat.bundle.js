import { ChatBubble } from './components';
frappe.provide('frappe.Chat2');

frappe.Chat = class {
	constructor() {
		this.setup_app();
	}
	setup_app() {
		const app_html = `
			<div class='chat-app'></div>
		`;
		$('body').append(app_html);
		this.is_open = true;
		this.app_element = $('.chat-app');
		this.chat_bubble = new ChatBubble(this);
	}
	setup_events() {}
};
