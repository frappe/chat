import ChatRoom from './chat_room';
import ChatAddRoom from './chat_add_room';
import ChatUserSettings from './chat_user_settings';
import { get_rooms, mark_message_read } from './chat_utils';

export default class ChatList {
  constructor(opts) {
    this.$wrapper = opts.$wrapper;
    this.user = opts.user;
    this.user_email = opts.user_email;
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
				<h3>${__('Chats')}</h3>
        <div class='chat-list-icons'>
          <div class='add-room' 
            title='Create Private Room'>
            ${frappe.utils.icon('users', 'md')}
          </div>
          <div class='user-settings' 
          title='Settings'>
          ${frappe.utils.icon('setting-gear', 'md')}
          </div>
        </div>
			</div>
		`;
    this.$chat_list.append(chat_list_header_html);
  }

  setup_search() {
    const chat_list_search_html = `
		<div class='chat-search'>
			<div class='input-group'>
				<input class='form-control chat-search-box'
				type='search' 
				placeholder='${__('Search conversation')}'
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
      const res = await get_rooms(this.user_email);
      this.rooms = res;
      this.setup_rooms();
      this.render_messages();
    } catch (error) {
      frappe.msgprint({
        title: __('Error'),
        message: __('Something went wrong. Please refresh and try again.'),
      });
    }
  }

  setup_rooms() {
    this.$chat_rooms_container = $(document.createElement('div'));
    this.$chat_rooms_container.addClass('chat-rooms-container');
    this.chat_rooms = [];

    this.rooms.forEach((element) => {
      let profile = {
        user: this.user,
        user_email: this.user_email,
        last_message: element.last_message,
        last_date: element.modified,
        is_admin: this.is_admin,
        room: element.name,
        is_read: element.is_read,
        room_name: element.room_name,
        room_type: element.type,
        opposite_person_email: element.opposite_person_email,
      };

      this.chat_rooms.push([
        profile.room,
        new ChatRoom({
          $wrapper: this.$wrapper,
          $chat_rooms_container: this.$chat_rooms_container,
          chat_list: this,
          element: profile,
        }),
      ]);
    });
    this.$chat_list.append(this.$chat_rooms_container);
  }

  fitler_rooms(query) {
    for (const room of this.chat_rooms) {
      const txt = room[1].profile.room_name.toLowerCase();
      if (txt.includes(query)) {
        room[1].$chat_room.show();
      } else {
        room[1].$chat_room.hide();
      }
    }
  }

  create_new_room(profile) {
    this.chat_rooms.unshift([
      profile.room,
      new ChatRoom({
        $wrapper: this.$wrapper,
        $chat_rooms_container: this.$chat_rooms_container,
        chat_list: this,
        element: profile,
      }),
    ]);
    this.chat_rooms[0][1].render('prepend');
  }

  setup_events() {
    const me = this;
    $('.chat-search-box').on('input', function (e) {
      me.fitler_rooms($(this).val().toLowerCase());
    });

    $('.add-room').on('click', function (e) {
      if (typeof me.chat_add_room_modal === 'undefined') {
        me.chat_add_room_modal = new ChatAddRoom({
          user: me.user,
          user_email: me.user_email,
        });
      }
      me.chat_add_room_modal.show();
    });

    $('.user-settings').on('click', function (e) {
      if (typeof me.chat_user_settings === 'undefined') {
        me.chat_user_settings = new ChatUserSettings();
      }
      me.chat_user_settings.show();
    });
  }

  render_messages() {
    this.$chat_rooms_container.empty();
    for (const element of this.chat_rooms) {
      element[1].render('append');
    }
  }

  render() {
    this.$wrapper.html(this.$chat_list);
    this.setup_events();
  }

  move_room_to_top(chat_room_item) {
    this.chat_rooms = [
      chat_room_item,
      ...this.chat_rooms.filter((item) => item !== chat_room_item),
    ];
  }

  setup_socketio() {
    const me = this;
    frappe.realtime.on('latest_chat_updates', function (res) {
      //Find the room with the specified room id
      const chat_room_item = me.chat_rooms.find(
        (element) => element[0] === res.room
      );

      if (typeof chat_room_item === 'undefined') {
        return;
      }

      if (
        !$('.chat-element').is(':visible') &&
        frappe.Chat.settings.user.enable_notifications === 1
      ) {
        frappe.utils.play_sound('chat-notification');
      }

      const message =
        res.content.length > 24
          ? res.content.substring(0, 24) + '...'
          : res.content;

      chat_room_item[1].set_last_message(message, res.creation);

      if ($('.chat-list').length) {
        chat_room_item[1].set_as_unread();
        chat_room_item[1].move_to_top();
        me.move_room_to_top(chat_room_item);
      } else if ($('.chat-space').length) {
        mark_message_read(res.room);
      }
    });

    frappe.realtime.on('new_room_creation', function (res) {
      if (
        !$('.chat-element').is(':visible') &&
        frappe.Chat.settings.user.enable_notifications === 1
      ) {
        frappe.utils.play_sound('chat-notification');
      }

      res.user = me.user;
      res.is_admin = me.is_admin;
      res.user_email = me.user_email;
      me.create_new_room(res);
    });

    frappe.realtime.on('private_room_creation', function (res) {
      if (
        !$('.chat-element').is(':visible') &&
        frappe.Chat.settings.user.enable_notifications === 1
      ) {
        frappe.utils.play_sound('chat-notification');
      }

      if (res.members.includes(me.user_email)) {
        if (res.room_type === 'Direct') {
          res.room_name =
            res.member_names[0]['email'] == me.user_email
              ? res.member_names[1]['name']
              : res.member_names[0]['name'];

          res.opposite_person_email =
            res.member_names[0]['email'] == me.user_email
              ? res.member_names[1]['email']
              : res.member_names[0]['email'];
        }

        res.user = me.user;
        res.is_admin = me.is_admin;
        res.user_email = me.user_email;
        me.create_new_room(res);
      }
    });
  }
}
