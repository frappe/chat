// Copyright (c) 2021, codescientist703 and contributors
// For license information, please see license.txt

frappe.listview_settings['Chat Message'] = {
  filters: [['sender_email', '=', frappe.session.user]],
};
