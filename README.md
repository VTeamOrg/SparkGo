# SparkGo when starting up

run npm install i /backend

# Extra Check for database

sudo apt update

sudo apt install mysql

sudo service mariadb start

sudo systemctl status mariadb

# Setup database

in /sql

run

sudo mariadb --table < reset.sql

eller endast test databasen

sudo mariadb --table < reset_test.sql

# Run test

in /backend

npm test

Tests against the api endpoints created

Tests against get,post,put,del created

# Testing fixes

Test againt the backend is using different models (/testmodels) not relying on res messages as the productions does to easier test in gitub action using mockups of the database, not having to reset database data everytime

# Run server

in/backend

node app.js

# Current endpoints

/users and users/id

/stations and stations/id

/cities and cities/id

/vehicles and vehicles/id
