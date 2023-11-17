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

sudo mariadb --table < resetAll.sql

eller endast test databasen

sudo mariadb --table < reset test.sql

# Run test

in /backend

npm test

runs tests against the api endpoints created

# Run server

in/backend

node app.js

# Current endpoints

/users and users/id

/stations and stations/id

/cities and cities/id

/vehicles and vehicles/id
