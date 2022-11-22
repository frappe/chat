import moment from 'moment';

function get_time(time) {
  let current_time;
  if (time) {
    current_time = moment(time);
  } else {
    current_time = moment();
  }
  return current_time.format('h:mm A');
}

function get_date_from_now(dateObj, type) {
  const sameDay = type === 'space' ? '[Today]' : 'h:mm A';
  const elseDay = type === 'space' ? 'MMM D, YYYY' : 'DD/MM/YYYY';
  const result = moment(dateObj).calendar(null, {
    sameDay: sameDay,
    lastDay: '[Yesterday]',
    lastWeek: elseDay,
    sameElse: elseDay,
  });
  return result;
}

function is_date_change(dateObj, prevObj) {
  const curDate = moment(dateObj).format('DD/MM/YYYY');
  const prevDate = moment(prevObj).format('DD/MM/YYYY');
  return curDate !== prevDate;
}

function scroll_to_bottom($element) {
  $element.animate(
    {
      scrollTop: $element[0].scrollHeight,
    },
    300
  );
}

function is_image(filename) {
  const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif|\.webp)$/i;
  if (!allowedExtensions.exec(filename)) {
    return false;
  }
  return true;
}

async function get_rooms(email) {
  const res = await frappe.call({
    type: 'GET',
    method: 'chat.api.room.get',
    args: {
      email: email,
    },
  });
  return await res.message;
}

async function get_messages(room, email) {
  const res = await frappe.call({
    method: 'chat.api.message.get_all',
    args: {
      room: room,
      email: email,
    },
  });
  return await res.message;
}

async function send_message(content, user, room, email) {
  try {
    await frappe.call({
      method: 'chat.api.message.send',
      args: {
        content: content,
        user: user,
        room: room,
        email: email,
      },
    });
  } catch (error) {
    frappe.msgprint({
      title: __('Error'),
      message: __('Something went wrong. Please refresh and try again.'),
    });
  }
}

async function get_settings(token) {
  const res = await frappe.call({
    type: 'GET',
    method: 'chat.api.config.settings',
    args: {
      token: token,
    },
  });
  return await res.message;
}

async function mark_message_read(room) {
  try {
    await frappe.call({
      method: 'chat.api.message.mark_as_read',
      args: {
        room: room,
      },
    });
  } catch (error) {
    //pass
  }
}


async function create_guest({ email, full_name, message }) {
  const res = await frappe.call({
    method: 'chat.api.user.get_guest_room',
    args: {
      email: email,
      full_name: full_name,
      message: message,
    },
  });
  return await res.message;
}

async function set_typing(room, user, is_typing, is_guest) {
  try {
    await frappe.call({
      method: 'chat.api.message.set_typing',
      args: {
        room: room,
        user: user,
        is_typing: is_typing,
        is_guest: is_guest,
      },
    });
  } catch (error) {
    //pass
  }
}

async function create_private_room(room_name, users, type) {
  await frappe.call({
    method: 'chat.api.room.create_private',
    args: {
      room_name: room_name,
      users: users,
      type: type,
    },
  });
}

async function set_user_settings(settings) {
  await frappe.call({
    method: 'chat.api.config.user_settings',
    args: {
      settings: settings,
    },
  });
}

function get_avatar_html(room_type, user_email, room_name) {
  let avatar_html;
  if (room_type === 'Direct' && 'desk' in frappe) {
    avatar_html = frappe.avatar(user_email, 'avatar-medium');
  } else {
    avatar_html = frappe.get_avatar('avatar-medium', room_name);
  }
  return avatar_html;
}

function set_notification_count(type) {
  const current_count = frappe.Chat.settings.unread_count;
  if (type === 'increment') {
    $('#chat-notification-count').text(current_count + 1);
    frappe.Chat.settings.unread_count += 1;
  } else {
    if (current_count - 1 === 0) {
      $('#chat-notification-count').text('');
    } else {
      $('#chat-notification-count').text(current_count - 1);
    }
    frappe.Chat.settings.unread_count -= 1;
  }
}

export {
  get_time,
  scroll_to_bottom,
  get_rooms,
  get_messages,
  get_settings,
  create_guest,
  send_message,
  get_date_from_now,
  is_date_change,
  mark_message_read,
  set_typing,
  is_image,
  create_private_room,
  set_user_settings,
  get_avatar_html,
  set_notification_count,
};
