import { get_current_time, scroll_to_bottom } from './chat_utils';

export default class ChatSpace {
	constructor(parent, profile) {
		this.parent = parent;
		this.profile = profile;
		this.setup();
	}

	setup() {
		this.$chat_space = $(document.createElement('div'));
		this.$chat_space.addClass('chat-space');
		this.setup_config();
		this.setup_header();
		this.setup_messages();
		this.setup_actions();
		this.render();
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
		const header_html = `
			<div class="chat-space-header">
				<div class="chat-back-button" data-toggle="tooltip" title="Go Back" >
					<i class="fa fa-angle-left fa-lg" aria-hidden="true"></i>
				</div>
				${this.parent.avatar_html}
				<div class="chat-profile-info">
					<div class="chat-profile-name">${this.profile.name}</div>
					<div class="chat-profile-time">14 mins ago</div>
				</div>
				<i class="fa fa-expand fa-lg chat-expand-button"></i>
			</div>
		`;
		this.$chat_space.append(header_html);
	}

	setup_messages() {
		this.$chat_space_container = $(document.createElement('div'));
		this.$chat_space_container.addClass('chat-space-container');

		let message_html = `
			${this.make_sender_message('Hi john titor ?', '12:01 pm')}
			${this.make_recipient_message(
				'Hey, so I’m having a party at my place next weekend. Do you want to come?',
				'1:58 pm'
			)}
		`;

		const date_line_html = `
			<div class="date-line"><span>Today</span></div>
		`;

		for (let i = 0; i < 3; i++) {
			message_html += date_line_html + message_html;
		}
		this.$chat_space_container.html(message_html);
		this.$chat_space.append(this.$chat_space_container);
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
			me.parent.parent.render();
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
		frappe.realtime.publish('frappe.chat.room:subscribe', 'test');
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
			this.make_recipient_message(message, get_current_time())
		);
		$type_message.val('');
		scroll_to_bottom(this.$chat_space_container);
		frappe.call({
			method: 'chat.api.message.send',
			args: {
				message: message,
				user: this.user,
			},
		});
	}

	receive_message(message, time) {
		this.$chat_space_container.append(this.make_sender_message(message, time));
		scroll_to_bottom(this.$chat_space_container);
	}

	render() {
		this.parent.parent.parent.$chat_container.html(this.$chat_space);
		this.setup_events();
		scroll_to_bottom(this.$chat_space_container);
	}
}
