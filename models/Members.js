var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var Member = new keystone.List('Member', {
	map: { name: 'name' },
	autokey: { path: 'slug', from: 'name', unique: true }
});

Member.add({
	name: { type: String, required: true },
  avatarUrl: { type: Types.Url },
  bio: { type: Types.Text },
  email: { type: Types.Email },
  twitter: { type: Types.Text },
  github: { type: Types.Text }
});

Member.defaultColumns = 'name|20%';
Member.register();
