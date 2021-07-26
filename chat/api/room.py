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
			cg.email
		FROM `tabChat Room` cr
			LEFT JOIN `tabChat Guest` cg 
			ON cr.guest = cg.name
		ORDER BY cr.last_message DESC
	""", as_dict=1)
    return data
