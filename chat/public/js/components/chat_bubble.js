export default class ChatBubble {
  constructor(parent) {
    this.parent = parent;
    this.setup();
  }

  setup() {
    this.$chat_bubble = $(document.createElement('div'));
    this.open_title = 'Chat with us';
    this.closed_title = 'Close Chat';
    this.open_inner_html = `
			<div class='p-3 chat-bubble'>
				<i class='fa fa-comment 
					pl-2 fa-lg fa-flip-horizontal'
				>
				</i>
				<div>Chat With Us</div>
			</div>
		`;
    this.closed_inner_html = `
		<div class='chat-bubble-closed chat-bubble'>
			<i class='fa fa-times fa-2x cross-icon'></i>
		</div>
		`;
    this.$chat_bubble
      .attr({
        'data-toggle': 'tooltip',
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
