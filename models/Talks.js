var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var Talk = new keystone.List('Page', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'title', unique: true }
});

Talk.add({
	title: { type: String, required: true },
	description: { type: Types.Textarea, height: 400 },
  speaker: { type: Types.Relationship, ref: 'Member' },
	youtubeVideoId: { type: Types.Text }
});

Talk.defaultColumns = 'title, state|20%';
Talk.register();
