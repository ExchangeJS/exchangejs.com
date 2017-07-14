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
  state: { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },
  expires_on: { type: Types.Date, initial: true, required: true },
  title: { type: String, initial: true, required: true },
  company: { type: String, initial: true, required: true },
  company_logo: { type: Types.Url },
  location: { type: String, initial: true, required: true },
  is_remote: { type: Boolean, label: 'Can you work remotely?' },
  compensation: { type: String },
  comp_type: { type: Types.Select, options: 'salary, contract, options', default: 'salary', index: true },
  what: { type: Types.Markdown, wysiwyg: true, required: true, initial: false, initial: true, required: true },
  about_company: { type: Types.Markdown, wysiwyg: true, required: true, initial: false, initial: true, required: true},
  find_out_more: { type: Types.Url },
  email_to_apply: { type: Types.Email, required: true, initial: true } 
});

Job.defaultColumns = 'title, company, state|20%, expires_on';  
Job.register();
