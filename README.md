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

# local test vs generate code coverage

Coverage generation , change line in package.json to:

"test": "nyc mocha --recursive --exit test/routes test/apiLimiter/",

Lokal test and for githubaction , change line in package.json to:

"test": "mocha --recursive --exit test/routes test/apiLimiter/",


To add more folders to coverage add in

"nyc": {
        "reporter": ["clover", "html"],
        "include": [
            "models/tokenModel.js",
            "testmodels/**/*.js",
            "routes/httpRoutes/index.js",
            "routes/websocketRoutes/*.js"
        ],
        "exclude": [
            "test/**"

        ]
    },


