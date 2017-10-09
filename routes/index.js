var express = require('express');
var csrfProtection = require('csurf')({cookie: true})

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

	router.post('/submit-your-job', csrfProtection, (req, res, next) => {
		const KEYS = ['title', 'department', 'employment_type', 'company', 'location', 'summary', 'details', 'url_to_find_out_more', 'url_to_apply', 'expires_on', 'contact_email']
		const formData = Object.assign(
			Object.keys(req.body).filter(key => KEYS.indexOf(key) !== -1)
				.reduce((acc, key) => {
					acc[key] = req.body[key]
					return acc
				}, {}),
			{state: 'submitted'}
		)
		const Job = keystone.list('Job')
		const newJob = new Job.model(formData)
		newJob.save(err => {
			if (err && err.status === 403) {
				req.error = 'Invalid token. Leave us alone.'
			} else if (err) {
				req.err = 'Unable to save your submission. Please try again or get in touch with us.'
			} else {
				req.submitted = true
			}
			next()
		})
	})

	router.all('/submit-your-job', csrfProtection, (req, res) => {
		res.render('submit-job.hbs', {
			error: req.err,
			token: req.csrfToken(),
			submitted: req.submitted
		})
	})

	router.get('/issues', (req, res) => {
		res.redirect('https://github.com/ExchangeJS/exchangejs-org/issues');
	});

	router.get('/sponsorship', (req, res) => {
		res.redirect('https://docs.google.com/forms/d/e/1FAIpQLSdiQn9w6Ghz3VVOTqlhwXj5v5ojLBDoPMc74ciQtq9aWgXNoQ/viewform?usp=sf_link');
	});

	return router;
}
