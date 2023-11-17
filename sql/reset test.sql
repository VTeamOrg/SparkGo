-- reset test

-- drops
drop database if exists test;

-- creates
create database test;

-- uses
use test;

-- runs tables script
source ddl test.sql
source inser test.sql

