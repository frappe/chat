import ChatForm from './chat_form';

export default class ChatWelcome {
  constructor(opts) {
    this.$wrapper = opts.$wrapper;
    this.profile = opts.profile;
    this.setup();
  }

  setup() {
    this.$chat_welcome_screen = $(document.createElement('div')).addClass(
      'chat-welcome'
    );

    const welcome_html = `
			<div class='chat-welcome-header'>
					<span class='hero-icon'>
						<svg xmlns="http://www.w3.org/2000/svg" width="1.4rem" height="1.4rem" viewBox="0 0 24 24">
						<path d="M12 1c-6.627 0-12 4.364-12 9.749 0 3.131 1.817 5.917 4.64 7.7.868 2.167-1.083 4.008-3.142 4.503 2.271.195 6.311-.121 9.374-2.498 7.095.538 13.128-3.997 13.128-9.705 0-5.385-5.373-9.749-12-9.749z"/>
						</svg>
					</span>
					<h3>${__('Hi there ! 🙌🏼')}</h3>
					<p>
						${__('We make it simple to connect with us.')}
						${__('Ask us anything, or share your feedback.')}
					</p>
			</div>
		`;

    const status_text =
      this.profile.chat_status === 'Online'
        ? __('We are online')
        : __('We are offline');

    const reason_text =
      this.profile.chat_status === 'Online'
        ? __('Typically replies in a few hours')
        : __('Just drop a message and we will get back to you soon');

    const bottom_html = `
			<div class='chat-welcome-footer'>
				<p class='status-content'>${status_text}</p>
				<p class='hero-content'>${reason_text}</p>
				<button type='button' class='btn btn-primary w-100'
					id='start-conversation'>
					${__('Start Conversation')}
				</button>
				<a class='chat-footer welcome-footer' target='_blank' href='https://frappeframework.com/'>
					${__('⚡ Powered by Frappe')}
				</a>
			</div>
		`;

    this.$chat_welcome_screen.append(welcome_html + bottom_html);
  }

  setup_events() {
    const me = this;
    $('#start-conversation').on('click', function () {
      me.chat_form = new ChatForm({
        $wrapper: me.$wrapper,
        profile: me.profile,
      });
      me.chat_form.render();
    });
  }

  render() {
    this.$wrapper.html(this.$chat_welcome_screen);
    this.setup_events();
  }
}
