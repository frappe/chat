export default class ChatUpload {
  constructor(chat_space, room) {
    this.chat_space = chat_space;
    this.room = room;
    this.file = null;
    this.setup();
    this.setup_events();
  }

  setup() {
    this.modal_html = `
			<div class="modal fade " tabindex="-1" role="dialog" id="chat-file-upload-modal">
				<div class="modal-dialog" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title" id="exampleModalLabel">Attach a file</h5>
							<button type="button" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="modal-body d-flex justify-content-center flex-column align-items-center">
						   <span class='chat-attach-item'>${frappe.utils.icon('upload')}</span>
							 <a href="#" class="chat-file-preview" target='_blank'></a>
						</div>
						<div class="modal-footer d-flex justify-content-end">
							<button type="button" class="btn btn-secondary btn-sm btn-modal-secondary mr-3" data-dismiss="modal">
								Close
							</button>
							<button	button type="button" class="btn btn-primary btn-sm btn-modal-primary" id="chat-file-submit">Upload</button>
							<input type='file' id='chat-file-uploader' 
								accept='image/*, application/pdf, .doc, .docx'
								style='display: none;'
							>
						</div>
					</div>
				</div>
			</div>
		`;
    $('body').append(this.modal_html);
    this.$upload_modal = $('#chat-file-upload-modal');
  }

  show() {
    this.$upload_modal.modal('show');
  }

  hide() {
    this.$upload_modal.modal('hide');
  }

  async handle_upload_file(file) {
    const dataurl = await frappe.dom.file_to_base64(file.file_obj);
    file.dataurl = dataurl;
    file.name = file.file_obj.name;
    return this.upload_file(file);
  }

  upload_file(file) {
    const me = this;
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();

      xhr.upload.addEventListener('load', () => {
        resolve();
      });

      xhr.addEventListener('error', () => {
        reject(frappe.throw(__('Internal Server Error')));
      });
      xhr.onreadystatechange = () => {
        if (xhr.readyState == XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            let r = null;
            let file_doc = null;
            try {
              r = JSON.parse(xhr.responseText);
              if (r.message.doctype === 'File') {
                file_doc = r.message;
              }
            } catch (e) {
              r = xhr.responseText;
            }
            if (file_doc === null) {
              reject(frappe.throw(__('File upload failed!')));
            } else {
              me.chat_space.handle_send_message(file_doc.file_url);
            }
          } else {
            try {
              const error = JSON.parse(xhr.responseText);
              const messages = JSON.parse(error._server_messages);
              const errorObj = JSON.parse(messages[0]);
              reject(frappe.throw(__(errorObj.message)));
            } catch (e) {
              // pass
            }
          }
        }
      };

      xhr.open('POST', '/api/method/upload_file', true);
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.setRequestHeader('X-Frappe-CSRF-Token', frappe.csrf_token);

      let form_data = new FormData();

      form_data.append('file', file.file_obj, file.name);
      form_data.append('is_private', +false);

      form_data.append('doctype', 'Chat Room');
      form_data.append('docname', me.room);

      xhr.send(form_data);
    });
  }

  setup_events() {
    const me = this;
    $('.chat-attach-item').on('click', function () {
      $('#chat-file-uploader').click();
    });

    $('#chat-file-uploader').on('change', function () {
      if (this.files.length > 0) {
        me.file = {};
        me.file.file_obj = this.files[0];
        $('.chat-file-preview')
          .text(me.file.file_obj.name)
          .attr({ href: URL.createObjectURL(me.file.file_obj) });
      }
    });

    $('#chat-file-submit').on('click', function () {
      if (me.file !== null) {
        me.handle_upload_file(me.file);
        me.hide();
        me.file = null;
        $('.chat-file-preview').text('');
      }
    });
  }
}
