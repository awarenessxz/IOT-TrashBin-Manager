var express = require('express');
var router = express.Router();

const dateFormat = require('dateformat');

/* Getting information from database */
const { Pool } = require('pg');
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

/* SQL Query */

var update_bins_height = 
// Internal height of bin = maximum distance measured by the sensor (assuming that sensor is properly attached to the bin, and there is a point in time where the bin will be empty).
`UPDATE TrashBinInfo tb
SET height = m.max_dist
FROM 
    (
    SELECT MAX(distance) AS max_dist, sd.topic_id
    FROM SensorData sd
    GROUP BY sd.topic_id
    ) m
WHERE tb.bin_id = m.topic_id
AND tb.height < m.max_dist`;

var compute_bins_info = 
`SELECT b.*, ROUND(((b.height - latest_avg_dist) / b.height) * 100) as percent_filled
FROM (
	SELECT ROUND(AVG(distance)) as latest_avg_dist, tb.bin_id, tb.height
	FROM (
		SELECT *, ROW_NUMBER() OVER (PARTITION BY topic_id ORDER BY dt desc) AS r 
		FROM SensorData 
		) sd JOIN TrashBinInfo tb
	ON sd.topic_id = tb.bin_id
	WHERE sd.r <= 5
	GROUP BY tb.bin_id, tb.height
) b`;

router.get('/', function(req, res, next) {

	pool.query(update_bins_height, (err, update) => {
		if (err) {
			console.log("[BIN_HEIGHT_ERR]", err, update);
		} else {
			console.log("[BIN] Successfully updated the height of bin(s).");
		}

		pool.query(compute_bins_info, (err, bins_info) => {
			if (err) {
				console.log("[BIN_COMPUTE_ERR]", err, bins_info);
			}

			for (var i = 0; i < bins_info.rows.length; i ++) {
				bins_info.rows[i].result = 0;
				var mod_remainder = bins_info.rows[i].percent_filled % 20;
					
				if (mod_remainder == 0) {
					bins_info.rows[i].result = bins_info.rows[i].percent_filled;
				} else {
					var roundUp = (bins_info.rows[i].percent_filled - mod_remainder) + 20;
					var roundDown = bins_info.rows[i].percent_filled - mod_remainder;
					bins_info.rows[i].result = ((roundUp - bins_info.rows[i].percent_filled) >= (bins_info.rows[i].percent_filled - roundDown)) ? roundDown : roundUp;
				}
				
				bins_info.rows[i].updated_dt = dateFormat(new Date(), 'ddd, dd mmm yyyy HH:MM:ss');
			}

			res.render('binStatus', {
				title: 'Live Trash Bin View', 
				data: bins_info.rows
			});
		});
	});
});

module.exports = router;
