#!/bin/bash
# build file for building/pushing an docker image

#DEFAULTS
IMAGE_NAME=sparkgo_backend
DOCKERHUB_USER=''
DOCKERHUB_TAG=1.0

# built with
docker build -t "$IMAGE_NAME" .