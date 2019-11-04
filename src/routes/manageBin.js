var express = require('express');
var router = express.Router();

/* Getting information from database */
const { Pool } = require('pg');
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

/* SQL Query */
var get_all_bins = `SELECT * FROM TrashBinInfo ORDER BY bin_id`;

router.get('/', function(req, res, next) {
	pool.query(get_all_bins, (err, bins_info) => {
		res.render('manageBin', {
			title: 'Live Trash Bin View',
			data: bins_info.rows
		});
	});
});

router.post('/', function(req, res, next) {
	// Handle redirection
	console.log(req.body);
});

module.exports = router;
