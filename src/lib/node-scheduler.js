var socketApi = require('../lib/socket-api');
const dateFormat = require('dateformat');

/* This is the scheduler that updates the database with analyze sensor data */
const { Pool } = require('pg');
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

/************************** SQL Query ****************************************/
// Process and compute bin's current fullness based on average of 5 latest and valid distance readings.
// Valid distance readings should not be above the maximum height of the bin.
var compute_bins_info = 
	`SELECT b.*, ROUND(((b.height - latest_avg_dist) / b.height) * 100) AS percent_filled
	FROM (
		SELECT ROUND(AVG(c.distance)) as latest_avg_dist, c.bin_id, c.height, c.status
		FROM (
			SELECT *, ROW_NUMBER() OVER (PARTITION BY sd.topic_id ORDER BY dt desc) AS r 
			FROM SensorData sd JOIN TrashBinInfo tb
			ON sd.topic_id = tb.bin_id
			WHERE sd.distance <= tb.height
			) c
		WHERE c.r <= 5
		GROUP BY c.bin_id, c.height, c.status
	) b`;

/****************************************************************************/

/* query for bin status every 5 seconds */
function updateTrashBinLevel() {
	pool.query(compute_bins_info, (err, bins_info) => {
		if (err) {
			console.log("[BIN_COMPUTE_ERR]", err, bins_info);
		} else {
			for (var i = 0; i < bins_info.rows.length; i ++) {
				bins_info.rows[i].result = 0;
				var mod_remainder = bins_info.rows[i].percent_filled % 20;
						
				if (mod_remainder == 0) {
					bins_info.rows[i].result = bins_info.rows[i].percent_filled;
				} else {
					var roundUp = (bins_info.rows[i].percent_filled - mod_remainder) + 20;
					var roundDown = bins_info.rows[i].percent_filled - mod_remainder;
					bins_info.rows[i].result = ((roundUp - bins_info.rows[i].percent_filled) > (bins_info.rows[i].percent_filled - roundDown)) ? roundDown : roundUp;
				}
				
				bins_info.rows[i].updated_dt = dateFormat(new Date(), 'ddd, dd mmm yyyy HH:MM:ss');
			}

			socketApi.updateTrashBinLevelData(bins_info.rows);
		}

	});
}

/****************************************************************************/

function scheduleTrashBinLevelUpdate(time) {
	setTimeout(function() {
		setInterval(updateTrashBinLevel, time);
	}, 2000);
};

module.exports = {
	scheduleTrashBinLevelUpdate

};