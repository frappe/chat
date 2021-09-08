// Copyright (c) 2021, codescientist703 and contributors
// For license information, please see license.txt

frappe.ui.form.on('Chat Settings', {
  after_save: function (frm) {
    $('.chat-app').remove();
    $('.chat-navbar-icon').remove();
    if (frm.doc.enable_chat) {
      new frappe.Chat();
    }
  },
});
