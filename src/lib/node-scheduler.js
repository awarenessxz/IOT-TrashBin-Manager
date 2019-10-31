var socketApi = require('../lib/socket-api');
const dateFormat = require('dateformat');

/* This is the scheduler that updates the database with analyze sensor data */
const { Pool } = require('pg');
const pool = new Pool({
	connectionString: process.env.DATABASE_URL
});

/************************** SQL Query ****************************************/

// Internal height of bin = maximum distance measured by the sensor (assuming that sensor is properly attached to the bin, and there is a point in time where the bin will be empty).
var update_bins_height = 
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

// Process and compute bin's current fullness
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

/****************************************************************************/

/* update trashbin level every 5 seconds */
function updateTrashBinLevel() {
	pool.query(update_bins_height, (err, update) => {
		if (err) {
			console.log("[BIN_HEIGHT_ERR]", err, update);
		} else {
			console.log("[BIN] Successfully updated the height of bin(s).");
		}
	});
};

/* query for bin status every 5 seconds */
function queryTrashBinLevel() {
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
					bins_info.rows[i].result = ((roundUp - bins_info.rows[i].percent_filled) >= (bins_info.rows[i].percent_filled - roundDown)) ? roundDown : roundUp;
				}
				
				bins_info.rows[i].updated_dt = dateFormat(new Date(), 'ddd, dd mmm yyyy HH:MM:ss');
			}

			socketApi.updateTrashBinLevelData(bins_info.rows);
		}
	});
}

function scheduleTrashBinInfoUpdate(time) {
	setInterval(updateTrashBinLevel, time);
};

function scheduleTrashBinLevelUpdate(time) {
	setTimeout(function() {
		setInterval(queryTrashBinLevel, time)
	}, 2000);
};

module.exports = { 
	scheduleTrashBinInfoUpdate,
	scheduleTrashBinLevelUpdate,
};