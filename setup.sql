DROP TABLE IF EXISTS TrashBinInfo CASCADE;
DROP TABLE IF EXISTS SensorData CASCADE;

CREATE TABLE TrashBinInfo (
	bin_id varchar(100) PRIMARY KEY,
	status numeric NOT NULL, 			-- percentage of fillness
	location varchar(100) NOT NULL		-- gps location
);

CREATE TABLE SensorData (
	topic_id varchar(100),
	distance numeric NOT NULL,
	dt timestamp NOT NULL,
	FOREIGN KEY(topic_id) REFERENCES TrashBinInfo(bin_id) ON DELETE CASCADE,
	PRIMARY KEY(topic_id, dt)
);

-- Inserting dummy data
INSERT INTO TrashBinInfo VALUES ('bin/sensor1', 0, 'lat lang');
INSERT INTO TrashBinInfo VALUES ('bin/sensor2', 0.2, 'lat lang');
INSERT INTO TrashBinInfo VALUES ('bin/sensor3', 0.5, 'lat lang');
INSERT INTO TrashBinInfo VALUES ('bin/sensor4', 1, 'lat lang');