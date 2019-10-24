DROP TABLE IF EXISTS TrashBinInfo CASCADE;
DROP TABLE IF EXISTS SensorData CASCADE;

CREATE TABLE TrashBinInfo (
	bin_id varchar(100) PRIMARY KEY,
	status numeric NOT NULL, 			-- percentage of fillness
	location varchar(100) NOT NULL		-- gps location
);

CREATE TABLE SensorData (
	topic_id varchar(100) PRIMARY KEY,
	distance numeric NOT NULL,
	dt timestamp NOT NULL,
	FOREIGN KEY(topicID) REFERENCES TrashBinInfo(binID) ON DELETE CASCADE
);

-- Inserting dummy data
INSERT INTO TrashBinInfo VALUES ('B1', 0, 'lat lang');
INSERT INTO TrashBinInfo VALUES ('B2', 0.2, 'lat lang');
INSERT INTO TrashBinInfo VALUES ('B3', 0.5, 'lat lang');
INSERT INTO TrashBinInfo VALUES ('B4', 1, 'lat lang');