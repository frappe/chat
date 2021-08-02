import frappe
from frappe import _


@frappe.whitelist(allow_guest=True)
def get():
    data = frappe.db.sql("""
		SELECT
			cr.name,
			cr.modified,
			cr.last_message,
			cg.guest_name,
			cg.email,
			cr.is_read
		FROM `tabChat Room` cr
			LEFT JOIN `tabChat Guest` cg 
			ON cr.guest = cg.name
		ORDER BY cr.is_read ASC, cr.modified DESC
	""", as_dict=1)
    return data
