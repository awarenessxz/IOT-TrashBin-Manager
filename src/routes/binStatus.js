var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('binStatus', { 
  	title: 'Live Trash Bin View' 
  });
});

module.exports = router;
