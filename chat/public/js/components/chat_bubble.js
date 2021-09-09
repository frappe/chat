export default class ChatBubble {
  constructor(parent) {
    this.parent = parent;
    this.setup();
  }

  setup() {
    this.$chat_bubble = $(document.createElement('div'));
    this.open_title = this.parent.is_admin
      ? __('Show Chats')
      : __('Chat With Us');
    this.closed_title = __('Close Chat');

    const bubble_visible = this.parent.is_desk === true ? 'd-none' : '';
    this.open_inner_html = `
			<div class='p-3 chat-bubble ${bubble_visible}'>
				<span class='chat-message-icon'>
					<svg xmlns="http://www.w3.org/2000/svg" width="1.1rem" height="1.1rem" viewBox="0 0 24 24">
					<path d="M12 1c-6.627 0-12 4.364-12 9.749 0 3.131 1.817 5.917 4.64 7.7.868 2.167-1.083 4.008-3.142 4.503 2.271.195 6.311-.121 9.374-2.498 7.095.538 13.128-3.997 13.128-9.705 0-5.385-5.373-9.749-12-9.749z"/>
					</svg>
				</span>
				<div>${this.open_title}</div>
			</div>
		`;
    this.closed_inner_html = `
		<div class='chat-bubble-closed chat-bubble ${bubble_visible}'>
			<span class='cross-icon'>
				${frappe.utils.icon('close-alt', 'lg')}
			</span>
		</div>
		`;
    this.$chat_bubble
      .attr({
        title: this.open_title,
        id: 'chat-bubble',
      })
      .html(this.open_inner_html);
  }

  render() {
    this.parent.$app_element.append(this.$chat_bubble);
    this.setup_events();
  }

  change_bubble() {
    this.parent.is_open = !this.parent.is_open;
    if (this.parent.is_open === false) {
      this.$chat_bubble
        .attr({
          title: this.open_title,
        })
        .html(this.open_inner_html);
      this.parent.hide_chat_widget();
    } else {
      this.$chat_bubble
        .attr({
          title: this.closed_title,
        })
        .html(this.closed_inner_html);
      this.parent.show_chat_widget();
    }
  }

  setup_events() {
    const me = this;
    $('#chat-bubble, .chat-cross-button').on('click', () => {
      me.change_bubble();
    });
  }
}
