export default class ChatSpace {
	constructor(parent) {
		this.parent = parent;

		const header_html = `
			<div>Hola Senor</div>
		`;
		this.parent.parent.parent.$chat_container.html(header_html);
	}
}
