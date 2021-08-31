import frappe
from frappe import _


@frappe.whitelist(allow_guest=True)
def get():
    data = frappe.db.sql("""
		SELECT
			cr.name,
			cr.modified,
			cr.last_message,
			cr.is_read,
			cr.room_name
		FROM `tabChat Room` cr
			LEFT JOIN `tabChat Guest` cg 
			ON cr.guest = cg.name
		ORDER BY cr.is_read ASC, cr.modified DESC
	""", as_dict=1)
    return data
