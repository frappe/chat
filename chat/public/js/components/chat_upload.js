export default class ChatBubble {
  constructor() {
    this.setup();
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
						<div class="modal-body">
							<input type="file" id="customFile" 
							class="form-control-file"
							accept="image/*,.pdf,.doc,.docx">
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
							<button type="button" class="btn btn-primary">Upload</button>
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
}
