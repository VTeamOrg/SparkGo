USE test;

-- Initial drops
DROP TRIGGER IF EXISTS log_scooter_insert;
DROP TRIGGER IF EXISTS log_scooter_update;
DROP TABLE IF EXISTS Rent;
DROP TABLE IF EXISTS Scooter;
DROP TABLE IF EXISTS Number;
DROP TABLE IF EXISTS User;
DROP TABLE IF EXISTS Renting_station;
DROP TABLE IF EXISTS Company;
DROP TABLE IF EXISTS City;

-- Create schema for e-scooter database
CREATE TABLE Company (
    Id INT PRIMARY KEY,
    name VARCHAR(255),
    number VARCHAR(255),
    employees INT
);

CREATE TABLE City (
    Id INT PRIMARY KEY,
    name VARCHAR(255)
);

CREATE TABLE Number (
    embg VARCHAR(255) PRIMARY KEY,
    phone_number VARCHAR(255) UNIQUE
);

CREATE TABLE Renting_station (
    Id INT PRIMARY KEY,
    name VARCHAR(255),
    number_e_scooter INT,
    company_have_r_station INT,
    r_station_located_in INT,
    FOREIGN KEY (company_have_r_station) REFERENCES Company(Id),
    FOREIGN KEY (r_station_located_in) REFERENCES City(Id)
);

CREATE TABLE member  (
    embg VARCHAR(255) PRIMARY KEY,
    roles int,
    firstname VARCHAR(255),
    lastname VARCHAR(255),
    date_born DATE,
    phone_number VARCHAR(255),
    FOREIGN KEY (phone_number) REFERENCES Number(phone_number)
);

CREATE TABLE Scooter (
    Id INT PRIMARY KEY,
    country VARCHAR(255),
    price DECIMAL(10, 2),
    status VARCHAR(255),
    scooter_is_on_station INT,
    FOREIGN KEY (scooter_is_on_station) REFERENCES Renting_station(Id)
);

CREATE TABLE Rent (
    Id INT PRIMARY KEY,
    rented_at DATETIME,
    returned_at DATETIME,
    user_renting VARCHAR(255),
    r_station_rented_from INT,
    r_station_returned_to INT,
    scooter_rented_scooter INT,
    FOREIGN KEY (user_renting) REFERENCES member(embg),
    FOREIGN KEY (r_station_rented_from) REFERENCES Renting_station(Id),
    FOREIGN KEY (r_station_returned_to) REFERENCES Renting_station(Id),
    FOREIGN KEY (scooter_rented_scooter) REFERENCES Scooter(Id)
);

-- Create triggers for the scooter table
DROP TRIGGER IF EXISTS log_scooter_insert;
DROP TRIGGER IF EXISTS log_scooter_update;

DELIMITER //

CREATE TRIGGER log_scooter_insert
AFTER INSERT ON Scooter
FOR EACH ROW
BEGIN
    INSERT INTO system_log (event)
    VALUES (CONCAT('new scooter added with scooter id ', NEW.Id, '.'));
END//

CREATE TRIGGER log_scooter_update
AFTER UPDATE ON Scooter
FOR EACH ROW
BEGIN
    INSERT INTO system_log (event)
    VALUES (CONCAT('scooter details for scooter id ', NEW.Id, ' updated.'));
END//

DELIMITER ;

SHOW TABLES;