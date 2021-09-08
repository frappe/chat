import { get_all_users, create_private_room } from './chat_utils';

export default class ChatAddRoom {
  constructor(opts) {
    this.user = opts.user;
    this.user_email = opts.user_email;
    this.room_users = [this.user_email];
    this.room_name = '';
    this.setup();
  }

  async setup() {
    this.modal_html = `
      <div class="modal fade" id="add-new-room" tabindex="-1" role="dialog"  aria-hidden="true">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" >New Private Room</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <div class="form-group">
                <label for="room-name" class="col-form-label">Room Name:</label>
                <input type="text" class="form-control" id="room-name">
              </div>
              <div class="form-group">
                <label for="room-name" class="col-form-label">Users List:</label>
                <div class="users-list">
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary btn-sm btn-modal-secondary" data-dismiss="modal">
                Close
              </button>
              <button type="button" class="btn btn-primary btn-sm btn-modal-primary" id='create-new-room'>
                Create Room
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    $('body').append(this.modal_html);
    this.$chat_room = $('#add-new-room');
    this.show_user_list();
  }

  async show_user_list() {
    try {
      const users = await get_all_users();
      let user_html = '';
      users.forEach((user) => {
        if (user.name !== this.user_email) {
          user_html += `
            <div class="form-check py-2">
              <input class="form-check-input" type="checkbox" value="${
                user.name
              }" >
              <label class="form-check-label" >
                ${__(user.full_name)}
              </label>
            </div>
          `;
        }
      });
      $('.users-list').html(user_html);
      this.setup_events();
    } catch (error) {
      frappe.msgprint({
        title: __('Error'),
        message: __('Something went wrong. Please refresh and try again.'),
      });
    }
  }

  show() {
    this.$chat_room.modal('show');
  }

  async handle_room_creation() {
    try {
      const room_name = $('#room-name').val();
      await create_private_room(room_name, this.room_users);
    } catch (error) {
      frappe.msgprint({
        title: __('Error'),
        message: __('Something went wrong. Please refresh and try again.'),
      });
    } finally {
      this.$chat_room.modal('hide');
    }
  }

  setup_events() {
    const me = this;
    $('.users-list input:checkbox').on('change', function (e) {
      if (e.target.checked === true) {
        me.room_users.push(e.target.value);
      } else {
        me.room_users = me.room_users.filter(function (user) {
          return user !== e.target.value;
        });
      }
    });

    $('#create-new-room').on('click', function () {
      me.handle_room_creation();
    });
  }
}
