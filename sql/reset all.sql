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



-- drops
drop database if exists sparkgo;

-- reset production

-- creates
create database sparkgo;

-- välj vilken databas du vill använda
use sparkgo;

-- uses
source ddl.sql
source insert.sql
