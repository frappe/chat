import ChatSpace from './chat_space';

export default class ChatMessage {
	constructor(opts) {
		this.$wrapper = opts.$wrapper;
		this.$chat_message_container = opts.$chat_message_container;
		this.chat_list = opts.chat_list;
		this.profile = opts.element;
		this.setup();
	}

	setup() {
		this.$chat_message = $(document.createElement('div'));
		this.$chat_message.addClass('chat-room');

		this.avatar_html = frappe.avatar(null, 'avatar-medium', this.profile.name);
		this.is_latest = Math.random() < 0.5;

		const is_latest_html = `
			<div class="chat-latest"></div>
		`;

		const info_html = `
			<div class="mr-auto chat-profile-info pl-3">
				<div class="font-weight-bold">${this.profile.name}</div>
				<div style="color: ${
					this.is_latest ? 'var(--gray-800)' : 'var(--gray-600)'
				}">Hello, whats up?</div>
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
	}

	render() {
		this.$chat_message_container.append(this.$chat_message);
		this.setup_events();
	}

	setup_events() {
		this.$chat_message.on('click', () => {
			if (typeof this.chat_space !== 'undefined') {
				this.chat_space.render();
			} else {
				this.chat_space = new ChatSpace(
					this.$wrapper,
					this.chat_list,
					this.profile
				);
			}
		});
	}
}
