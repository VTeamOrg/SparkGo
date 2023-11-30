-- reset test

-- drops
drop database if exists test;

-- creates
create database test;

-- uses
use test;

-- create user + grant
--CREATE USER 'dbadm'@'localhost' IDENTIFIED BY 'P@ssw0rd';
--GRANT ALL PRIVILEGES ON sparkgo.* TO 'dbadm'@'localhost';
--GRANT ALL PRIVILEGES ON test.* TO 'dbadm'@'localhost';
--FLUSH PRIVILEGES;

-- runs tables script
--source ddl test.sql
--source insert test.sql
source ddl.sql
source ddl_view.sql
source insert.sql


-- drops
drop database if exists sparkgo;

-- reset production

-- creates
create database sparkgo;

-- välj vilken databas du vill använda
use sparkgo;

-- uses
source ddl.sql
source ddl_view.sql
source insert.sql
