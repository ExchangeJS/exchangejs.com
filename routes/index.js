var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {title: 'Exchange.js'});
});

router.get('/code-of-conduct', function(req, res) {
  res.render('code-of-conduct', {title: 'Code of Conduct'});
});

module.exports = router;
