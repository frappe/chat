function get_current_time() {
	const current_time = new Date().toLocaleString('en-US', {
		hour: 'numeric',
		minute: 'numeric',
		hour12: true,
	});
	return current_time;
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
async function get_messages(room) {}
async function get_settings() {
	const res = await frappe.call({
		type: 'GET',
		method: 'chat.api.config.settings',
	});
	return await res.message;
}
async function setup_dependencies(port) {
	await frappe.require(
		[
			'assets/frappe/js/lib/socket.io.min.js',
			'assets/frappe/js/frappe/socketio_client.js',
		],
		() => {
			frappe.socketio.init(port);
		}
	);
}
export {
	get_current_time,
	scroll_to_bottom,
	get_rooms,
	get_settings,
	setup_dependencies,
};
