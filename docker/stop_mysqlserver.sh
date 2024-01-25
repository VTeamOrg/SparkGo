#!/bin/bash
CONT_NAME=my_sql_srv
docker stop ${CONT_NAME}
docker container rm ${CONT_NAME}
