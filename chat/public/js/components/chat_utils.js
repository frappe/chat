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
  const sameDay = type === 'space' ? '[Today]' : 'HH:MM A';
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

async function get_rooms() {
  const res = await frappe.call({
    type: 'GET',
    method: 'chat.api.room.get',
  });
  return await res.message;
}

async function get_messages(room) {
  const res = await frappe.call({
    method: 'chat.api.message.get_all',
    args: {
      room: room,
    },
  });
  return await res.message;
}

async function send_message(message, user, room) {
  try {
    await frappe.call({
      method: 'chat.api.message.send',
      args: {
        message: message,
        user: user,
        room: room,
      },
    });
  } catch (error) {
    console.error(error);
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
    console.error(error);
  }
}

async function setup_dependencies(socketio_port) {
  await frappe.require(
    [
      'assets/frappe/js/lib/socket.io.min.js',
      'assets/frappe/js/frappe/socketio_client.js',
    ],
    () => {
      frappe.socketio.init(socketio_port);
    }
  );
}

async function create_guest({ email, full_name, message }) {
  const res = await frappe.call({
    method: 'chat.api.user.validate_guest',
    args: {
      email: email,
      full_name: full_name,
      message: message,
    },
  });
  return await res.message;
}

export {
  get_time,
  scroll_to_bottom,
  get_rooms,
  get_messages,
  get_settings,
  create_guest,
  send_message,
  setup_dependencies,
  get_date_from_now,
  is_date_change,
  mark_message_read,
};
