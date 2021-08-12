import ChatSpace from './chat_space';
import { get_date_from_now, mark_message_read, get_time } from './chat_utils';

export default class ChatRoom {
  constructor(opts) {
    this.$wrapper = opts.$wrapper;
    this.$chat_rooms_container = opts.$chat_rooms_container;
    this.chat_list = opts.chat_list;
    this.profile = opts.element;
    this.setup();
  }

  setup() {
    this.$chat_room = $(document.createElement('div'));
    this.$chat_room.addClass('chat-room');

    this.avatar_html = frappe.avatar(null, 'avatar-medium', this.profile.name);

    let last_message = this.profile.last_message || '';
    if (this.profile.last_message) {
      if (last_message.length > 24) {
        last_message = this.profile.last_message.substring(0, 24) + '...';
      }
    }
    const info_html = `
			<div class='chat-profile-info'>
				<div class='chat-name'>
					${__(this.profile.name)} 
					<div class='chat-latest' 
						style='display: ${this.profile.is_read ? 'none' : 'inline-block'}'
					></div>
				</div>
				<div style='color: ${
          this.profile.is_read ? 'var(--gray-600)' : 'var(--gray-800)'
        }' class='last-message'>${__(last_message)}</div>
			</div>
		`;
    const date_html = `
			<div class='chat-date'>
				${__(get_date_from_now(this.profile.last_date, 'room'))}
			</div>
		`;
    let inner_html = '';

    inner_html += this.avatar_html + info_html + date_html;

    this.$chat_room.html(inner_html);
  }

  set_as_read() {
    this.profile.is_read = 1;
    this.$chat_room.find('.last-message').css('color', 'var(--gray-600)');
    this.$chat_room.find('.chat-latest').hide();
  }

  set_last_message(message, date) {
    this.$chat_room.find('.last-message').text(__(message));
    this.$chat_room.find('.chat-date').text(__(get_time(date)));
  }

  set_as_unread() {
    this.profile.is_read = 0;
    this.$chat_room.find('.last-message').css('color', 'var(--gray-800)');
    this.$chat_room.find('.chat-latest').show();
  }

  render(mode) {
    if (mode == 'append') {
      this.$chat_rooms_container.append(this.$chat_room);
    } else {
      this.$chat_rooms_container.prepend(this.$chat_room);
    }

    this.setup_events();
  }

  setup_events() {
    this.$chat_room.on('click', () => {
      if (typeof this.chat_space !== 'undefined') {
        this.chat_space.render();
      } else {
        this.chat_space = new ChatSpace({
          $wrapper: this.$wrapper,
          chat_list: this.chat_list,
          profile: this.profile,
        });
      }
      if (this.profile.is_read === 0) {
        mark_message_read(this.profile.room);
        this.set_as_read();
      }
    });
  }
}
