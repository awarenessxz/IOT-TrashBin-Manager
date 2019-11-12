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
	
	if (req.body.update) {
		// validation (REQUIRED)
		var bid = req.body.original_bid;
		var new_bid = req.body.bid;
		var new_height = req.body.bheight;

		if (new_bid && new_height) {
			// prepare sql query
			update_sql_query = `UPDATE TrashBinInfo SET bin_id=$1, height=$2 WHERE bin_id=$3`;

			// Query
			pool.query(update_sql_query, [new_bid, new_height, bid], (err, data) => {
				if (err) {
					req.flash('error', 'ERROR: ' + err["detail"]);
					res.status(err.status || 500).redirect('back');
				} else {
					req.flash('success', 'Successfully submitted Request.');
					res.status(200).redirect('/manageBin');
				}
			});
		} else {
			req.flash('error', 'ERROR! Please do not leave blank.');
			res.status(403).redirect('back');
		}
	} else if (req.body.add) {
		// validation (REQUIRED)
		var new_bid = req.body.bid;
		var new_height = req.body.bheight;

		if (new_bid && new_height) {
			// prepare sql query
			insert_sql_query = `INSERT INTO TrashBinInfo VALUES($1, 'Offline', 'lat long', $2)`;

			// Query
			pool.query(insert_sql_query, [new_bid, new_height], (err, data) => {
				if (err) {
					req.flash('error', 'ERROR! ' + err["detail"]);
					res.status(err.status || 500).redirect('back');
				} else {
					req.flash('success', 'Trash Bin "' + new_bid + '" with height ' + new_height + ' added successfully');
					res.status(200).redirect('/manageBin');
				}
			});
		} else {
			req.flash('error', 'ERROR! Please do not leave blank.');
			res.status(403).redirect('back');
		}
	}
});

module.exports = router;
