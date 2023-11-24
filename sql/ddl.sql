use sparkgo;

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

-- create schema for e-scooter database
create table city (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name varchar(255) NOT NULL
);

CREATE TABLE frequencies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE renting_station (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    coords_lat DECIMAL(10, 6), 
    coords_long DECIMAL(10, 6), 
    FOREIGN KEY (city_id) REFERENCES city(id)
);

CREATE TABLE member (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    personal_number VARCHAR(255),
    address VARCHAR(255)
);

CREATE TABLE payment_method (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    method_name VARCHAR(255) NOT NULL,
    reference_info VARCHAR(255) NOT NULL,
    is_selected ENUM('Y', 'N') DEFAULT 'N',
    FOREIGN KEY (member_id) REFERENCES member(id)
);

CREATE TABLE vehicle (
    id INT AUTO_INCREMENT PRIMARY KEY,
    city_id INT NOT NULL,
    type VARCHAR(255) NOT NULL,
    rented_by INT,
    FOREIGN KEY (city_id) REFERENCES city(id),
    FOREIGN KEY (rented_by) REFERENCES member(id)
);

CREATE TABLE plan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) DEFAULT 0,
    price_frequency_id INT DEFAULT 0,
    included_unlocks INT DEFAULT 0,
    included_unlocks_frequency_id INT DEFAULT 0,
    included_minutes INT DEFAULT 0,
    included_minutes_frequency_id INT DEFAULT 0,
    FOREIGN KEY (price_frequency_id) REFERENCES frequencies(id),
    FOREIGN KEY (included_unlocks_frequency_id) REFERENCES frequencies(id),
    FOREIGN KEY (included_minutes_frequency_id) REFERENCES frequencies(id)
);

CREATE TABLE active_plan (
    plan_id INT NOT NULL,
    member_id INT NOT NULL,
    activation_date DATE NOT NULL,
    available_minutes INT DEFAULT 0,
    available_unlocks INT DEFAULT 0,
    is_paused ENUM('Y', 'N') DEFAULT 'N',
    PRIMARY KEY (plan_id, member_id, activation_date),
    FOREIGN KEY (plan_id) REFERENCES plan(id),
    FOREIGN KEY (member_id) REFERENCES member(id)
);

CREATE TABLE receipt (
    id INT AUTO_INCREMENT PRIMARY KEY,
    member_id INT NOT NULL,
    payment_details VARCHAR(255),
    payment_type VARCHAR(255),
    receipt_details VARCHAR(255)
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