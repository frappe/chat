export default class ChatMessage {
	constructor(parent) {
		this.parent = parent;
		this.setup();
	}
	setup() {
		this.$chat_message = $(document.createElement('div'));
		this.$chat_message.addClass('chat-message');

		const avatar_html = frappe.avatar(null, 'avatar-medium', 'Speedwagon');

		const info_html = `
			<div class="mr-auto chat-profile-info pl-3">
				<div class="font-weight-bold">Nihal Mittal</div>
				<div style="color: var(--gray-600)">Hey, Jotaro?</div>
			</div>
		`;
		const date_html = `
			<div class="chat-date">
				Yesterday
			</div>
		`;
		this.$chat_message.html(avatar_html + info_html + date_html);
		this.parent.$chat_message_container.append(this.$chat_message);
	}
}
