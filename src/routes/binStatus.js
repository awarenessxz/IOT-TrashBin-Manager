var express = require('express');
var router = express.Router();
var nodeScheduler = require('../lib/node-scheduler');

/* Getting information from database */
const { Pool } = require('pg');
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

/* SQL Query */
var get_all_bins = `SELECT bin_id, 0 as percent_filled, 0 as result FROM TrashBinInfo ORDER BY bin_id`;

router.get('/', function(req, res, next) {
	pool.query(get_all_bins, (err, bins_info) => {
		res.render('binStatus', {
			title: 'Live Trash Bin View',
			data: bins_info.rows
		});
	});
});

module.exports = router;
