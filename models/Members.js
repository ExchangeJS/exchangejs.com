var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var Member = new keystone.List('Page', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'name', unique: true }
});

Member.add({
	name: { type: String, required: true },
  avatarUrl: { type: Types.Url },
  bio: { type: Types.Text },
  twitter: { type: Type.Text },
  github: { type: Type.Text }
});

Member.defaultColumns = 'name|20%';
Member.register();
