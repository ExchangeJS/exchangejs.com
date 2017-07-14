var express = require('express');

module.exports = (keystone) => {
	let router = express.Router();

	/* GET home page. */
	router.get('/', function(req, res) {
		let jobs = keystone.list('Job').model.find().limit(5);
		let talks = keystone.list('Talk').model.find().
			sort('-presentedOn').limit(2).populate('speaker');

		Promise.all([jobs, talks]).then(([jobs, talks]) => {
			res.render('index', {
				title: 'Exchange.js',
				jobs: jobs,
				talks: talks
			});
		});
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

	// REDIRECT TO JUNE 2017 MEMBER SURVEY
	// REMOVE AFTER JUNE 1st, 2017
	router.get('/survey', function(req, res) {
		res.redirect('https://docs.google.com/forms/d/e/1FAIpQLSdgVccwM-4LXiOx87v9dY9WyLnUO767Hj-7Aaw56jitVYUd9w/viewform?usp=sf_link');
	});
	
	
	router.get('/issues', function(req, res) {
		res.redirect('https://github.com/ExchangeJS/exchangejs-org/issues');
	});

	return router;
}
