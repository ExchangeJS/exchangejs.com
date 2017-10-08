var express = require('express');

module.exports = (keystone) => {
	let router = express.Router();

	/* GET home page. */
	router.get('/', (req, res) => {
		let jobs = keystone.list('Job').model.
			find({state: 'published', expires_on: { $gt: new Date() } }).limit(5);
		let talks = keystone.list('Talk').model.find().
			sort('-presentedOn').limit(2).populate('speaker');

		Promise.all([jobs, talks]).then(([jobs, talks]) => {
			res.render('index', {
				title: 'Exchange.js',
				is_homepage: true,
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

	router.get('/:page', (req, res, next) => {
		keystone.list('Page').model.findOne({
			state: 'published',
			slug: req.params.page
		}).exec((err, result) => {
			if (!result) {
				return next();
			}
			res.render('page', {
				title: result.title,
				content: result.content.html
			});
		});
	});

	router.get('/jobs', (req, res) => {
		let jobs = keystone.list('Job').model.
			find({state: 'published', expires_on: { $gt: new Date() } });

		jobs.then((jobs) => {
			res.render('jobs', { title: "Job Listings", jobs });
		});
	});

	router.get('/jobs/:slug', (req, res, next) => {
		keystone.list('Job').model.findOne({
			slug: req.params.slug
		}).
		then((job) => {
			if (!job) {
				return next();
			}

			res.render('job', job);
		});
	});

	router.post('/submit-your-job', (req, res, next) => {
		next()
	})

	router.get('/submit-your-job', (req, res) => {
		res.render('submit-job.hbs')
	})

	router.get('/issues', (req, res) => {
		res.redirect('https://github.com/ExchangeJS/exchangejs-org/issues');
	});

	router.get('/sponsorship', (req, res) => {
		res.redirect('https://docs.google.com/forms/d/e/1FAIpQLSdiQn9w6Ghz3VVOTqlhwXj5v5ojLBDoPMc74ciQtq9aWgXNoQ/viewform?usp=sf_link');
	});

	return router;
}
