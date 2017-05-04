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

	// REDIRECT TO DEMO NIGHT VOTE FORM
	// REMOVE AFTER MAY 4TH 2017
	router.get('/vote', function(req, res) {
		res.redirect('https://docs.google.com/forms/d/e/1FAIpQLScCJjxmCA8Zg4ONi0UzV32d59-j1w0cHKgQK4iDMdE9EJZdvQ/viewform?usp=sf_link');
	});

	return router;
}
