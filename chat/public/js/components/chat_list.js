import ChatMessage from './chat_message';

export default class ChatList {
	constructor(parent) {
		this.parent = parent;
		this.setup();
	}

	setup() {
		this.$chat_list = $(document.createElement('div'));
		this.$chat_list.addClass('chat-list');
		this.setup_header();
		this.setup_search();
		this.setup_message();
	}

	setup_header() {
		const chat_list_header_html = `
			<div class="chat-list-header">
				<h3>Chats</h3>
				<div class="chat-list-actions">
					<i class="fa fa-pencil-square-o fa-lg mr-2 text-primary"></i>
					<i class="fa fa-expand fa-lg chat-expand-button"></i>
				</div>
			</div>
		`;
		this.$chat_list.append(chat_list_header_html);
	}

	setup_search() {
		const chat_list_search_html = `
			<div class="input-group my-2 chat-search">
				<i class="fa fa-search pt-2 pl-3"></i>
				<input class="form-control py-1 chat-search-box" 
				type="search" 
				placeholder="Search or Create a new conversation"
				id="chat-searh-bix">	
			</div>
		`;
		this.$chat_list.append(chat_list_search_html);
	}

	setup_message() {
		this.$chat_message_container = $(document.createElement('div'));
		this.$chat_message_container.addClass('chat-message-container');
		this.chat_messages = [];
		for (let i = 0; i < 20; i++) {
			this.chat_messages.push(new ChatMessage(this));
		}
		this.$chat_list.append(this.$chat_message_container);
	}

	render() {
		this.chat_messages.forEach((element) => {
			element.render();
		});
		this.parent.$chat_container.html(this.$chat_list);
	}
}
