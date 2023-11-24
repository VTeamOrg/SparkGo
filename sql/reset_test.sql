-- reset test

-- drops
drop database if exists test;

-- creates
create database test;

-- uses
use test;

-- runs tables script
source ddl_test.sql
source insert_test.sql

