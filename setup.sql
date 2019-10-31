DROP TRIGGER IF EXISTS on_recv_sensor ON SensorData;
DROP TABLE IF EXISTS SensorData CASCADE;
DROP TABLE IF EXISTS TrashBinInfo CASCADE;
DROP FUNCTION IF EXISTS notify_new_data;

CREATE TABLE TrashBinInfo (
	bin_id varchar(100) PRIMARY KEY,
	status numeric NOT NULL, 			-- percentage of fillness
	location varchar(100) NOT NULL,		-- gps location
	height integer NOT NULL
);

CREATE TABLE SensorData (
	topic_id varchar(100),
	distance numeric NOT NULL,
	dt timestamp NOT NULL,
	FOREIGN KEY(topic_id) REFERENCES TrashBinInfo(bin_id) ON DELETE CASCADE,
	PRIMARY KEY(topic_id, dt)
);

-- Inserting dummy data
INSERT INTO TrashBinInfo VALUES ('bin/sensor1', 0, 'lat lang', 0);
INSERT INTO TrashBinInfo VALUES ('bin/sensor2', 0.2, 'lat lang', 0);
INSERT INTO TrashBinInfo VALUES ('bin/sensor3', 0.5, 'lat lang', 0);
INSERT INTO TrashBinInfo VALUES ('bin/sensor4', 1, 'lat lang', 0);

-- Creating stored procedure for pg_notify
CREATE OR REPLACE FUNCTION notify_new_data() RETURNS TRIGGER AS $$
  DECLARE
    record RECORD;
    payload JSON;
  BEGIN
	record = NEW;
	payload = json_build_object('table', TG_TABLE_NAME,
		'action', TG_OP,
		'data', row_to_json(record));
	PERFORM pg_notify('incoming_data', payload::text);

	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_recv_sensor
AFTER INSERT
ON SensorData
FOR EACH ROW
	EXECUTE PROCEDURE notify_new_data();
