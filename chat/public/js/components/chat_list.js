import ChatRoom from './chat_room';
import { get_rooms, mark_message_read } from './chat_utils';

export default class ChatList {
  constructor(opts) {
    this.$wrapper = opts.$wrapper;
    this.user = opts.user;
    this.is_admin = opts.is_admin;
    this.setup();
  }

  setup() {
    this.$chat_list = $(document.createElement('div'));
    this.$chat_list.addClass('chat-list');
    this.setup_header();
    this.setup_search();
    this.fetch_and_setup_rooms();
    this.setup_socketio();
  }

  setup_header() {
    const chat_list_header_html = `
			<div class='chat-list-header'>
				<h3>Chats</h3>
			</div>
		`;
    this.$chat_list.append(chat_list_header_html);
  }

  setup_search() {
    const chat_list_search_html = `
		<div class='chat-search'>
			<div class=' input-group'>
				<input class='form-control chat-search-box'
				type='search' 
				placeholder='Search or Create a new conversation'
				>	
				<span class='search-icon'>
					${frappe.utils.icon('search', 'sm')}
				</span>
			</div>
		</div>
		`;
    this.$chat_list.append(chat_list_search_html);
  }

  async fetch_and_setup_rooms() {
    try {
      const res = await get_rooms();
      this.rooms = res;
      this.setup_rooms();
      this.render_messages();
    } catch (error) {
      console.error(error);
    }
  }

  setup_rooms() {
    this.$chat_rooms_container = $(document.createElement('div'));
    this.$chat_rooms_container.addClass('chat-rooms-container');
    this.chat_rooms = new Map();
    this.rooms.forEach((element) => {
      const profile = {
        name: element.guest_name,
        user: this.user,
        last_message: element.last_message,
        last_date: element.modified,
        is_admin: this.is_admin,
        room: element.name,
        is_read: element.is_read,
      };
      this.chat_rooms.set(
        profile.room,
        new ChatRoom({
          $wrapper: this.$wrapper,
          $chat_rooms_container: this.$chat_rooms_container,
          chat_list: this,
          element: profile,
        })
      );
    });
    this.$chat_list.append(this.$chat_rooms_container);
  }

  fitler_rooms(query) {
    for (const room of this.chat_rooms.values()) {
      const txt = room.profile.name.toLowerCase();
      if (txt.includes(query)) {
        room.$chat_room.show();
      } else {
        room.$chat_room.hide();
      }
    }
  }

  setup_events() {
    const me = this;
    $('.chat-search-box').on('input', function (e) {
      me.fitler_rooms($(this).val().toLowerCase());
    });
  }

  render_messages() {
    this.$chat_rooms_container.empty();
    for (const element of this.chat_rooms.values()) {
      element.render();
    }
  }

  render() {
    this.$wrapper.html(this.$chat_list);
    this.setup_events();
  }
  setup_socketio() {
    const me = this;
    frappe.realtime.publish(
      'frappe.chat.room:subscribe',
      'latest_chat_updates'
    );
    frappe.realtime.on('last_message', function (res) {
      const chat_room_item = me.chat_rooms.get(res.room);
      chat_room_item.set_last_message(res.message);

      if ($('.chat-list').length) {
        chat_room_item.set_as_unread();
      } else if ($('.chat-space').length) {
        mark_message_read(res.room);
      }
    });
  }
}
