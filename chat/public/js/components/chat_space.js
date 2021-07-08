export default class ChatSpace {
	constructor(parent) {
		this.parent = parent;
		this.setup();
	}
	setup() {
		this.$chat_space = $(document.createElement('div'));
		this.$chat_space.addClass('chat-space');
		this.setup_header();
		this.setup_messages();
		this.setup_actions();
		this.render();
	}
	setup_header() {
		const header_html = `
			<div class="chat-space-header">
				<div class="chat-back-button" data-toggle="tooltip" title="Go Back" >
					<i class="fa fa-angle-left fa-lg" aria-hidden="true"></i>
				</div>
				${this.parent.avatar_html}
				<div class="chat-profile-info">
					<div class="chat-profile-name">Nihal Mittal</div>
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
			<div class="sender-message">
				<div class="message-bubble">Hi, Steve ?</div>
				<div class="message-time">12:58 pm</div>
			</div>
			<div class="recipient-message">
				<div class="message-bubble">Hey, so I’m having a party at my place next weekend. Do you want to come?</div>
				<div class="message-time">1:58 pm</div>
			</div>
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
	}
	render() {
		this.parent.parent.parent.$chat_container.html(this.$chat_space);
		this.setup_events();
	}
}
