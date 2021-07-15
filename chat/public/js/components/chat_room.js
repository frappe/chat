import ChatSpace from './chat_space';
import { get_date_from_now } from './chat_utils';

export default class ChatRoom {
	constructor(opts) {
		this.$wrapper = opts.$wrapper;
		this.$chat_rooms_container = opts.$chat_rooms_container;
		this.chat_list = opts.chat_list;
		this.profile = opts.element;
		this.setup();
	}

	setup() {
		this.$chat_room = $(document.createElement('div'));
		this.$chat_room.addClass('chat-room');

		this.avatar_html = frappe.avatar(null, 'avatar-medium', this.profile.name);
		this.is_latest = Math.random() < 0.5;

		const is_latest_html = `
			<div class="chat-latest"></div>
		`;

		const info_html = `
			<div class="mr-auto chat-profile-info pl-3">
				<div class="font-weight-bold">${this.profile.name}</div>
				<div style="color: ${this.is_latest ? 'var(--gray-800)' : 'var(--gray-600)'}">${
			this.profile.last_message
		}</div>
			</div>
		`;
		const date_html = `
			<div class="chat-date">
				${get_date_from_now(this.profile.last_date)}
			</div>
		`;
		let inner_html = '';
		if (this.is_latest) {
			inner_html += is_latest_html;
		}
		inner_html += this.avatar_html + info_html + date_html;
		this.$chat_room.html(inner_html);
	}

	render() {
		this.$chat_rooms_container.append(this.$chat_room);
		this.setup_events();
	}

	setup_events() {
		this.$chat_room.on('click', () => {
			if (typeof this.chat_space !== 'undefined') {
				this.chat_space.render();
			} else {
				this.chat_space = new ChatSpace({
					$wrapper: this.$wrapper,
					chat_list: this.chat_list,
					profile: this.profile,
				});
			}
		});
	}
}
