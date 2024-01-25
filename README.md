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


# Code coverage

Run npm run test2 to generate into the coverage folder clover statistics

open covarage/index.html to view results


# Scrutiizer badge

[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/VTeamOrg/SparkGo/badges/quality-score.png?b=sparkgo_A)](https://scrutinizer-ci.com/g/VTeamOrg/SparkGo/?branch=sparkgo_A)


Scrutinizer linked to repo