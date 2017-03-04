var express = require('express');

module.exports = (keystone) => {
	let router = express.Router();

	/* GET home page. */
	router.get('/', function(req, res) {
		res.render('index', {title: 'Exchange.js'});
	});

	router.get('/talks', (req, res) => {
		keystone.list('Talk').model.find()
			.sort('-presentedOn')
			.populate('speaker')
			.exec((err, talks) => {
				res.render('talks', {
					title: 'Talks | Exchange.js',
					talks: talks
				});
			});
	});

	router.get('/:page', function(req, res, next) {
		keystone.list('Page').model.findOne({
			state: 'published',
			slug: req.params.page
		}).exec(function(err, result) {
			if (!result) {
				return next();
			}
			res.render('page', {
				title: result.title,
				content: result.content.html
			});
		});
	});

	return router;
}
