export default class ChatSpace {
	constructor(parent) {
		this.parent = parent;
		this.setup();
		this.setup_header();
		this.setup_messages();
		this.render();
		this.setup_events();
	}
	setup() {
		this.$chat_space = $(document.createElement('div'));
		this.$chat_space.addClass('chat-space');
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
				<i class="fa fa-expand fa-lg"></i>
			</div>
		`;
		this.$chat_space.append(header_html);
	}
	setup_messages() {
		this.$chat_space_container = $(document.createElement('div'));
		this.$chat_space_container.addClass('chat-space-container');

		let message_html = `
		
		`;
	}
	setup_events() {
		const me = this;
		$('.chat-back-button').on('click', function () {
			me.parent.parent.setup();
		});
	}
	render() {
		this.parent.parent.parent.$chat_container.html(this.$chat_space);
	}
}
