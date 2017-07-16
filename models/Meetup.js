var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Meetup Model
 * ==========
 */

var Meetup = new keystone.List('Meetup', {
	map: { name: 'date' },
});

Meetup.add({
	date: { type: Types.Date, required: true },
	meetup: { type: Types.Url },
	notes: { type: Types.Url },
	video: { type: Types.Url }
});

Meetup.defaultColumns = 'date';
Meetup.register();
