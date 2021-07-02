export default class ChatBubble {
	constructor(parent) {
		this.parent = parent;
		this.setup();
	}
	setup() {
		this.chat_bubble = document.createElement('div');
		let classes = 'chat-bubble p-3';
		let title = 'Chat with us';
		let inner_html = `
			<i class="fa fa-comment 
				pl-2 fa-lg fa-flip-horizontal"
			>
			</i>
			<div>Chat With Us</div>
		`;
		if (this.parent.is_open === false) {
			classes = 'chat-bubble chat-bubble-closed';
			title = 'Close Chat';
			inner_html = `
				<i class="fa fa-times fa-2x cross-icon"></i>
			`;
		}
		$(this.chat_bubble)
			.addClass(classes)
			.attr({
				'data-toggle': 'tooltip',
				title: title,
			})
			.html(inner_html);

		this.render();
		this.setup_events();
	}
	render() {
		this.parent.app_element.append(this.chat_bubble);
	}
	setup_events() {
		$('.chat-bubble').click(() => {
			this.parent.is_open = !this.parent.is_open;
			this.chat_bubble.remove();
			this.setup();
		});
	}
}
