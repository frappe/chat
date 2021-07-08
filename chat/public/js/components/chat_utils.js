export function get_current_time() {
	const current_time = new Date().toLocaleString('en-US', {
		hour: 'numeric',
		minute: 'numeric',
		hour12: true,
	});
	return current_time;
}
