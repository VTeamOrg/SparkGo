use sparkgo;

-- initial drops
drop trigger if exists log_scooter_insert;
drop trigger if exists log_scooter_update;
drop table if exists rent;
drop table if exists scooter;
drop table if exists number;
drop table if exists user;
drop table if exists renting_station;
drop table if exists company;
drop table if exists city;

-- create schema for e-scooter database
create table company (
    id int primary key,
    name varchar(255),
    number varchar(255),
    employees int
);

create table city (
    id int primary key,
    name varchar(255)
);

create table number (
    embg varchar(255) primary key,
    phone_number varchar(255) unique
);

create table renting_station (
    id int primary key,
    name varchar(255),
    number_e_scooter int,
    company_have_r_station int,
    r_station_located_in int,
    foreign key (company_have_r_station) references company(id),
    foreign key (r_station_located_in) references city(id)
);

create table user (
    embg varchar(255) primary key,
    firstname varchar(255),
    lastname varchar(255),
    date_born date,
    phone_number varchar(255),
    foreign key (phone_number) references number(phone_number)
);

create table scooter (
    id int primary key,
    country varchar(255),
    price decimal(10, 2),
    status varchar(255),
    scooter_is_on_station int,
    foreign key (scooter_is_on_station) references renting_station(id)
);

create table rent (
    id int primary key,
    rented_at datetime,
    returned_at datetime,
    user_renting varchar(255),
    r_station_rented_from int,
    r_station_returned_to int,
    scooter_rented_scooter int,
    foreign key (user_renting) references user(embg),
    foreign key (r_station_rented_from) references renting_station(id),
    foreign key (r_station_returned_to) references renting_station(id),
    foreign key (scooter_rented_scooter) references scooter(id)
);

-- create triggers for the scooter table
drop trigger if exists log_scooter_insert;
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

delimiter ;

show tables;