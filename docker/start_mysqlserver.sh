#!/bin/bash
CONT_NAME=my_sql_srv
echo "starting mysql server"
FOLDER=$(pwd)

#if [ ! -d ${FOLDER}/conf.d ]; then
#  mkdir -p ${FOLDER}/conf.d
#  printf "[mysqld]\nlocal_infile=ON" > ${FOLDER}/my.cnf.d/my-custom.cnf
#fi

docker run --detach \
           --name=${CONT_NAME} \
           -e MYSQL_ROOT_PASSWORD=secret \
           -v $FOLDER/../sql:/host_sql_folder \
           mysql/mysql-server:latest
           #--volume=${FOLDER}/conf.d:/etc/my.cnf.d/ \
           
#sudo docker exec -it sparkgo_mysql bash

#mysql -uroot -p -e "SET GLOBAL local_infile=ON;
#mysql -uroot -p -e "show global variables like '%local%';"
#mysql -uroot -p --local-infile=1 --table < reset.sql
# mysqldump -u root -p sparkgo > /host_sql_folder/sparkgo.sql
# mysql -udbadmin -p -h sparkgo_mysql sparkgo

#mysql -udbadm -pP@ssw0rd -h localhost sparkgo