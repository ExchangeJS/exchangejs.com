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

	routeer.get('jobs/:slug', (req, res, next) => {
		keystone.list('Job').model.findOne({
			slog: req.params.slug
		}).
		then((result) => {
			if (!result) {
				return next();
			}

			let job = {
				title: result.title,
				company: result.company,
				location: result.location
			};

			res.render('job', job);
		});
	});
	
	router.get('/issues', function(req, res) {
		res.redirect('https://github.com/ExchangeJS/exchangejs-org/issues');
	});

	return router;
}
