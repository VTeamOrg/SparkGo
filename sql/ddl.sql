-- use sparkgo;

-- initial drops
drop trigger if exists log_scooter_insert;
drop trigger if exists log_scooter_update;
drop table if exists rent;
drop table if exists vehicle;
drop table if exists number;
drop table if exists user;
drop table if exists renting_station;
drop table if exists company;
drop table if exists city;
drop table if exists payment_method;
drop table if exists price_list;
drop table if exists receipt;
drop table if exists vehicle_type;
drop table if exists active_plan;
drop table if exists member;
drop table if exists plan;
drop table if exists frequencies;

-- create schema for e-scooter database
create table city (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name varchar(255)
);

CREATE TABLE frequencies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE vehicle_type (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) UNIQUE
);

CREATE TABLE renting_station (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city_id INT,
    name VARCHAR(255),
    coords_lat DECIMAL(10, 6), 
    coords_long DECIMAL(10, 6), 
    FOREIGN KEY (city_id) REFERENCES city(id)
);

CREATE TABLE price_list (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type_id INT, 
    list_name VARCHAR(255),
    price_per_minute DECIMAL(10, 2),
    price_per_unlock DECIMAL(10, 2),
    FOREIGN KEY (type_id) REFERENCES vehicle_type(id) 
);

CREATE TABLE member (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role VARCHAR(255),
    email VARCHAR(255),
    name VARCHAR(255),
    personal_number VARCHAR(255),
    address VARCHAR(255),
    wallet DECIMAL(10,2)
);

CREATE TABLE payment_method (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT,
    method_name VARCHAR(255),
    reference_info VARCHAR(255),
    is_selected ENUM('Y', 'N') DEFAULT 'N',
    FOREIGN KEY (member_id) REFERENCES member(id)
);

CREATE TABLE vehicle (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city_id INT,
    type_id INT, 
    vehicle_status VARCHAR(255),
    name VARCHAR(255),
    station_id INT,
    FOREIGN KEY (city_id) REFERENCES city(id),
    FOREIGN KEY (type_id) REFERENCES vehicle_type(id)
);

CREATE TABLE plan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    price DECIMAL(10, 2),
    price_frequency_id INT,
    included_unlocks INT,
    included_unlocks_frequency_id INT,
    included_minutes INT,
    included_minutes_frequency_id INT,
    FOREIGN KEY (price_frequency_id) REFERENCES frequencies(id),
    FOREIGN KEY (included_unlocks_frequency_id) REFERENCES frequencies(id),
    FOREIGN KEY (included_minutes_frequency_id) REFERENCES frequencies(id)
);

CREATE TABLE active_plan (
    plan_id INT,
    member_id INT,
    creation_date DATETIME,
    activation_date DATETIME,
    available_minutes INT,
    available_unlocks INT,
    is_paused ENUM('Y', 'N'),
    PRIMARY KEY (plan_id, member_id),
    FOREIGN KEY (plan_id) REFERENCES plan(id),
    FOREIGN KEY (member_id) REFERENCES member(id)
);

CREATE TABLE receipt (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT,
    payment_details VARCHAR(255),
    payment_type VARCHAR(255),
    receipt_details VARCHAR(255),
    sum DECIMAL(10, 2),
    payment_date DATETIME,
    FOREIGN KEY (member_id) REFERENCES member(id)
);

CREATE TABLE auth_tokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    auth_token VARCHAR(255),
    expires_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES member(id)
);


-- New tables for e-scooter parking
CREATE TABLE parking_zone (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city_id INT,
    name VARCHAR(255),
    coords_lat DECIMAL(10, 6), 
    coords_long DECIMAL(10, 6), 
    FOREIGN KEY (city_id) REFERENCES city(id)
);


/*create table scooter (
    id int primary key,
    country varchar(255),
    price decimal(10, 2),
    status varchar(255),
    scooter_is_on_station int,
    foreign key (scooter_is_on_station) references renting_station(id)
);*/

/*create table rent (
    id int primary key,
    rented_at datetime,
    returned_at datetime,
    user_renting varchar(255),
    r_station_rented_from int,
    r_station_returned_to int,
    scooter_rented_scooter int,
    foreign key (user_renting) references member(embg),
    foreign key (r_station_rented_from) references renting_station(id),
    foreign key (r_station_returned_to) references renting_station(id),
    foreign key (scooter_rented_scooter) references scooter(id)
); */

-- create triggers for the scooter table
/*drop trigger if exists log_scooter_insert;
drop trigger if exists log_scooter_update;

delimiter //

create trigger log_scooter_insert
after insert on scooter
for each row
begin
    insert into system_log (event)
    values (concat('new scooter added with scooter id ', new.id, '.'));
end//

create trigger log_scooter_update
after update on scooter
for each row
begin
    insert into system_log (event)
    values (concat('scooter details for scooter id ', new.id, ' updated.'));
end//

delimiter ; */

show tables;