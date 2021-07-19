import {
	get_time,
	scroll_to_bottom,
	get_messages,
	get_date_from_now,
	check_date_change,
} from './chat_utils';

export default class ChatSpace {
	constructor(opts) {
		this.chat_list = opts.chat_list;
		this.$wrapper = opts.$wrapper;
		this.profile = opts.profile;
		this.setup();
	}

	setup() {
		this.$chat_space = $(document.createElement('div'));
		this.$chat_space.addClass('chat-space');
		this.setup_config();
		this.setup_header();
		this.fetch_and_setup_messages();
		this.setup_socketio();
	}
	setup_config() {
		if (frappe.session.logged_in_user) {
			this.user = 'Admin';
		} else {
			this.user = 'Guest';
		}
	}

	setup_header() {
		this.avatar_html = frappe.avatar(null, 'avatar-medium', this.profile.name);
		const header_html = `
			<div class="chat-space-header">
				${
					this.profile.is_admin === true
						? `<div class="chat-back-button" data-toggle="tooltip" title="Go Back" >
								<i class="fa fa-angle-left fa-lg" aria-hidden="true"></i>
							</div>`
						: ``
				}
				${this.avatar_html}
				<div class="chat-profile-info">
					<div class="chat-profile-name">${this.profile.name}</div>
					<div class="chat-profile-time">14 mins ago</div>
				</div>
				<i class="fa fa-expand fa-lg chat-expand-button"></i>
			</div>
		`;
		this.$chat_space.append(header_html);
	}
	fetch_and_setup_messages() {
		get_messages(this.profile.room)
			.then((res) => {
				this.setup_messages(res);
				this.setup_actions();
				this.render();
			})
			.catch((err) => {
				console.error(err);
			});
	}

	setup_messages(messages_list) {
		this.$chat_space_container = $(document.createElement('div'));
		this.$chat_space_container.addClass('chat-space-container');

		this.make_messages_html(messages_list);

		this.$chat_space_container.html(this.message_html);
		this.$chat_space.append(this.$chat_space_container);
	}
	make_messages_html(messages_list) {
		this.prevMessage = {};
		this.message_html = ``;
		messages_list.forEach((element) => {
			const date_line_html = `
				<div class="date-line"><span>${get_date_from_now(
					element.creation,
					'space'
				)}</span></div>
			`;
			if ($.isEmptyObject(this.prevMessage)) {
				this.message_html += date_line_html;
			} else if (
				check_date_change(element.creation, this.prevMessage.creation)
			) {
				this.message_html += date_line_html;
			}
			this.message_html += this.make_sender_message(
				element.message,
				get_time(element.creation)
			);
			this.prevMessage = element;
		});
	}

	setup_actions() {
		this.$chat_actions = $(document.createElement('div'));
		this.$chat_actions.addClass('chat-space-actions');
		const chat_actions_html = `
			<i class="fa fa-paperclip fa-lg fa-flip-horizontal 
			fa-flip-vertical attach-items" >
			</i>
			<input class="form-control type-message" 
				type="search" 
				placeholder="Type message"
			>
			<div class="message-send-button">
				<span class="fa-stack">
					<i class="fa fa-circle fa-stack-2x" ></i>
					<i class="fa fa-paper-plane fa-stack-1x fa-inverse"></i>
				</span>
			</div>
		`;
		this.$chat_actions.html(chat_actions_html);
		this.$chat_space.append(this.$chat_actions);
	}

	setup_events() {
		const me = this;
		$('.chat-back-button').on('click', function () {
			me.chat_list.render_messages();
			me.chat_list.render();
		});
		$('.message-send-button').on('click', function () {
			me.send_message();
		});
		$('.type-message').keypress(function (e) {
			if (e.which === 13) {
				me.send_message();
			}
		});
	}

	setup_socketio() {
		const me = this;
		frappe.realtime.publish('frappe.chat.room:subscribe', this.profile.room);
		frappe.realtime.on('receive_message', function (res) {
			if (res.user !== me.user) {
				me.receive_message(res.message, '12:32 pm');
			}
		});
	}

	make_sender_message(message, time) {
		const sender_message_html = `
		<div class="sender-message">
			<div class="message-bubble">${message}</div>
			<div class="message-time">${time}</div>
		</div>
		`;
		return sender_message_html;
	}

	make_recipient_message(message, time) {
		const recipient_message_html = `
		<div class="recipient-message">
			<div class="message-bubble">${message}</div>
			<div class="message-time">${time}</div>
		</div>
		`;
		return recipient_message_html;
	}

	send_message() {
		const $type_message = $('.type-message');
		const message = $type_message.val();
		if (message.length === 0) {
			return;
		}
		this.$chat_space_container.append(
			this.make_recipient_message(message, get_time())
		);
		$type_message.val('');
		scroll_to_bottom(this.$chat_space_container);
		frappe.call({
			method: 'chat.api.message.send',
			args: {
				message: message,
				user: this.user,
				room: this.profile.room,
			},
		});
	}

	receive_message(message, time) {
		this.$chat_space_container.append(this.make_sender_message(message, time));
		scroll_to_bottom(this.$chat_space_container);
	}

	render() {
		this.$wrapper.html(this.$chat_space);
		this.setup_events();
		scroll_to_bottom(this.$chat_space_container);
	}
}
