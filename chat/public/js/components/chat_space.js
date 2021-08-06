import {
  get_time,
  scroll_to_bottom,
  get_messages,
  get_date_from_now,
  is_date_change,
  send_message,
  set_typing,
} from './chat_utils';

export default class ChatSpace {
  constructor(opts) {
    this.chat_list = opts.chat_list;
    this.$wrapper = opts.$wrapper;
    this.profile = opts.profile;
    this.setup();
  }

  setup() {
    this.$chat_space = $(document.createElement('div'));
    this.typing = false;
    this.$chat_space.addClass('chat-space');
    this.setup_header();
    this.fetch_and_setup_messages();
    this.setup_socketio();
  }

  setup_header() {
    this.avatar_html = frappe.avatar(null, 'avatar-medium', this.profile.name);
    const header_html = `
			<div class='chat-header'>
				${
          this.profile.is_admin === true
            ? `<span class='chat-back-button' data-toggle='tooltip' title='Go Back' >
								${frappe.utils.icon('left')}
							</span>`
            : ``
        }
				${this.avatar_html}
				<div class='chat-profile-info'>
					<div class='chat-profile-name'>
					${this.profile.name}
					<div class='online-circle'></div>
					</div>
					<div class='chat-profile-status'>Online</div>
				</div>
			</div>
		`;
    this.$chat_space.append(header_html);
  }
  fetch_and_setup_messages() {
    get_messages(this.profile.room)
      .then((res) => {
        this.setup_messages(res);
        this.setup_actions();
        this.render();
      })
      .catch((err) => {
        console.error(err);
      });
  }

  setup_messages(messages_list) {
    this.$chat_space_container = $(document.createElement('div'));
    this.$chat_space_container.addClass('chat-space-container');

    this.make_messages_html(messages_list);

    this.$chat_space_container.html(this.message_html);
    this.$chat_space.append(this.$chat_space_container);
  }
  make_messages_html(messages_list) {
    this.prevMessage = {};
    this.message_html = ``;
    if (this.profile.message) {
      messages_list.push(this.profile.message);
      send_message(
        this.profile.message.message,
        this.profile.user,
        this.profile.room
      );
    }
    messages_list.forEach((element) => {
      const date_line_html = this.make_date_line_html(element.creation);
      this.message_html += date_line_html;

      let message_type = 'recipient';

      if (this.profile.is_admin === true) {
        if (element.sender === 'Guest') {
          message_type = 'sender';
        }
      } else {
        if (element.sender !== 'Guest') {
          message_type = 'sender';
        }
      }

      this.message_html += this.make_message(
        element.message,
        get_time(element.creation),
        message_type
      ).prop('outerHTML');

      this.prevMessage = element;
    });
  }

  make_date_line_html(dateObj) {
    let result = `
			<div class='date-line'><span>${get_date_from_now(dateObj, 'space')}</span></div>
		`;
    if ($.isEmptyObject(this.prevMessage)) {
      return result;
    } else if (is_date_change(dateObj, this.prevMessage.creation)) {
      return result;
    } else {
      return '';
    }
  }

  setup_actions() {
    this.$chat_actions = $(document.createElement('div'));
    this.$chat_actions.addClass('chat-space-actions');
    const chat_actions_html = `
			<span class='attach-items'>
				${frappe.utils.icon('attachment', 'lg')}
			</span>
			<input class='form-control type-message' 
				type='search' 
				placeholder='Type message'
			>
			<div>
				<span class='message-send-button'>
					<svg xmlns="http://www.w3.org/2000/svg" width="1.1rem" height="1.1rem" viewBox="0 0 24 24">
						<path d="M24 0l-6 22-8.129-7.239 7.802-8.234-10.458 7.227-7.215-1.754 24-12zm-15 16.668v7.332l3.258-4.431-3.258-2.901z"/>
					</svg>
				</span>
			</div>
		`;
    this.$chat_actions.html(chat_actions_html);
    this.$chat_space.append(this.$chat_actions);
  }

  setup_events() {
    const me = this;

    //Timeout function
    me.typing_timeout = () => {
      me.typing = false;
    };

    $('.chat-back-button').on('click', function () {
      me.chat_list.render_messages();
      me.chat_list.render();
    });
    $('.message-send-button').on('click', function () {
      me.handle_send_message();
    });

    $('.type-message').keydown(function (e) {
      if (e.which === 13) {
        me.handle_send_message();
      } else {
        //Set as typing
        if (me.typing === false) {
          me.typing = true;
          set_typing(me.profile.room, me.profile.user, me.typing);

          me.timeout = setTimeout(me.typing_timeout, 3000);
        }
      }
    });
  }

  setup_socketio() {
    const me = this;

    frappe.realtime.on(this.profile.room, function (res) {
      me.receive_message(res, get_time(res.creation));
    });

    frappe.realtime.on(this.profile.room + ':typing', function (res) {
      me.get_typing_changes(res);
    });
  }

  get_typing_changes(res) {
    if (res.user != this.profile.user) {
      if (
        (this.profile.is_admin === true && res.user === 'Guest') ||
        this.profile.is_admin === false
      ) {
        if (res.is_typing === false) {
          $('.chat-profile-status').text('Online');
        } else {
          $('.chat-profile-status').text('Typing...');
          const timeout = setTimeout(() => {
            $('.chat-profile-status').text('Online');
          }, 3000);
        }
      }
    }
  }

  make_message(message, time, type) {
    const message_class =
      type === 'recipient' ? 'recipient-message' : 'sender-message';
    const $recipient_element = $(document.createElement('div')).addClass(
      message_class
    );
    const $message_element = $(document.createElement('div'))
      .addClass('message-bubble')
      .text(message);

    $recipient_element.append($message_element);
    $recipient_element.append(`<div class='message-time'>${time}</div>`);

    return $recipient_element;
  }

  handle_send_message() {
    const $type_message = $('.type-message');
    const message = $type_message.val();
    if (message.length === 0) {
      return;
    }
    this.typing = false;
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.$chat_space_container.append(
      this.make_message(message, get_time(), 'recipient')
    );
    $type_message.val('');
    scroll_to_bottom(this.$chat_space_container);
    send_message(message, this.profile.user, this.profile.room);
  }

  receive_message(res, time) {
    let chat_type = 'sender';
    if (res.user === this.profile.user) {
      return;
    }
    if (this.profile.is_admin === true && res.user !== 'Guest') {
      chat_type = 'recipient';
    }
    this.$chat_space_container.append(
      this.make_message(res.message, time, chat_type)
    );
    scroll_to_bottom(this.$chat_space_container);
  }

  render() {
    this.$wrapper.html(this.$chat_space);
    this.setup_events();
    scroll_to_bottom(this.$chat_space_container);
  }
}
