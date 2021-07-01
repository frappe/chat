export default class ChatBubble {
	constructor(parent) {
		this.parent = parent;
		this.setup();
	}
	setup = () => {
		this.chat_bubble_open_html = `
			<div class='chat-bubble p-3'
				data-toggle="tooltip"
				title="Chat with us"
			>
				<i class="fa fa-comment 
					pl-2 fa-lg fa-flip-horizontal" 
					aria-hidden="true">
				</i>
				<div>Chat With Us</div>
			</div>
		`;
		this.chat_bubble_closed_html = `
			<div class='chat-bubble chat-bubble-closed' 
				data-toggle="tooltip"
				title="Close Chat"
			>
				<i class="fa fa-times fa-2x cross-icon" 
					aria-hidden="true">
				</i>
			</div>
		`;
		this.render();
		this.setup_events();
	};
	render = () => {
		if (this.parent.is_open === true) {
			this.parent.app_element.html(this.chat_bubble_open_html);
		} else {
			this.parent.app_element.html(this.chat_bubble_closed_html);
		}
	};
	setup_events = () => {
		$('.chat-bubble').click(() => {
			this.parent.is_open = !this.parent.is_open;
			this.setup();
		});
	};
}
