import ChatSpace from './chat_space';

export default class ChatMessage {
	constructor(parent) {
		this.parent = parent;
		this.setup();
	}
	setup() {
		this.$chat_message = $(document.createElement('div'));
		this.$chat_message.addClass('chat-message');

		this.avatar_html = frappe.avatar(null, 'avatar-medium', 'Speedwagon');
		this.is_latest = Math.random() < 0.5;

		const is_latest_html = `
			<div class="chat-latest"></div>
		`;

		const info_html = `
			<div class="mr-auto chat-profile-info pl-3">
				<div class="font-weight-bold">Nihal Mittal</div>
				<div style="color: ${
					this.is_latest ? 'var(--gray-800)' : 'var(--gray-600)'
				}">Hey, Jotaro?</div>
			</div>
		`;
		const date_html = `
			<div class="chat-date">
				Yesterday
			</div>
		`;
		let inner_html = '';
		if (this.is_latest) {
			inner_html += is_latest_html;
		}
		inner_html += this.avatar_html + info_html + date_html;
		this.$chat_message.html(inner_html);
		this.render();
		this.setup_events();
	}
	render() {
		this.parent.$chat_message_container.append(this.$chat_message);
	}
	setup_events() {
		this.$chat_message.on('click', () => {
			new ChatSpace(this);
		});
	}
}
