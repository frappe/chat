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
export { get_current_time, scroll_to_bottom, get_rooms };
