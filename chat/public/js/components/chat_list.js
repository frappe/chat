import ChatRoom from './chat_room';
import { get_rooms } from './chat_utils';

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
			<div class='input-group my-2 chat-search'>
				<i class='fa fa-search pt-2 pl-3'></i>
				<input class='form-control py-1 chat-search-box'
				type='search' 
				placeholder='Search or Create a new conversation'
				>	
			</div>
		`;
    this.$chat_list.append(chat_list_search_html);
  }

  fetch_and_setup_rooms() {
    get_rooms().then((res) => {
      this.rooms = res;
      this.setup_rooms();
      this.render_messages();
    });
  }

  setup_rooms() {
    this.$chat_rooms_container = $(document.createElement('div'));
    this.$chat_rooms_container.addClass('chat-rooms-container');
    this.chat_rooms = [];
    this.rooms.forEach((element) => {
      const profile = {
        name: element.guest_name,
        user: this.user,
        last_message: element.last_message,
        last_date: element.modified,
        is_admin: this.is_admin,
        room: element.name,
      };
      this.chat_rooms.push(
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
    for (let room of this.chat_rooms) {
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
    this.chat_rooms.forEach((element) => {
      element.render();
    });
  }

  render() {
    this.$wrapper.html(this.$chat_list);
    this.setup_events();
  }
}
