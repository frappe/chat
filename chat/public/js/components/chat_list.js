import ChatMessage from './chat_message';

export default class ChatBubble {
	constructor(parent) {
		this.parent = parent;
		this.setup();
	}
	setup() {
		this.$chat_list = $(document.createElement('div'));
		const classes = 'chat-list';
		const chat_list_header_html = `
			<div class="chat-list-header">
				<h3>Chats</h3>
				<div class="chat-list-actions">
					<i class="fa fa-pencil-square-o fa-lg mr-2 text-primary"></i>
					<i class="fa fa-expand fa-lg"></i>
				</div>
			</div>
		`;
		const chat_list_search_html = `
			<div class="input-group my-2 chat-search">
				<i class="fa fa-search pt-2 pl-3"></i>
				<input class="form-control py-1 chat-search-box" 
				type="search" 
				placeholder="Search or Create a new conversation"
				id="chat-searh-bix">	
			</div>
		`;
		const inner_html = chat_list_header_html + chat_list_search_html;
		this.$chat_message_container = $(document.createElement('div'));
		this.$chat_message_container.addClass('chat-message-container');
		for (let i = 0; i < 20; i++) {
			new ChatMessage(this);
		}
		this.$chat_list.addClass(classes).html(inner_html);
		this.$chat_list.append(this.$chat_message_container);

		this.render();
	}
	render() {
		this.parent.$chat_container.html(this.$chat_list);
	}
}
