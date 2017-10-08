var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Jobs Model
 * ==========
 */

var Job = new keystone.List('Job', {
	autokey: { path: 'slug', from: 'company title', unique: true },
	map: { name: "title" }
});

Job.add({
	state: { type: Types.Select, options: 'submitted, draft, published, archived', default: 'draft', index: true },
	expires_on: { type: Types.Date, initial: true, required: true },
	contact_email: { type: Types.Email },
	title: { type: String, initial: true, required: true },
	department: { type: String },
	employment_type: { type: Types.Select, options: 'full-time, part-time, casual, contract', default: 'full-time', required: true },
	company: { type: String, initial: true, required: true },
	company_logo: { type: Types.Url },
	location: { type: String, initial: true, required: true },
	summary: { type: Types.Markdown, wysiwyg: true, required: true, initial: true },
	details: { type: Types.Markdown, wysiwyg: true, initial: false },
	url_to_find_out_more: { type: Types.Url, initial: true },
	url_to_apply: { type: Types.Url, required: true, initial: true }
});

Job.defaultColumns = 'title, company, state|20%, expires_on';
Job.register();
