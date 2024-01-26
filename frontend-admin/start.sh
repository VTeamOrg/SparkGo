#!/bin/bash

#default declarations
DOCKER_INTERNAL_PORT=5173
DEF_HOST_PORT=5173
DOCKER_IMAGE="sparkgo_frontend"

#check for existance of HOST_PORT
if [ -z ${HOST_PORT+x} ]; then
  echo "HOST_PORT is not defined - setting to $DEF_HOST_PORT";
  HOST_PORT=$DEF_HOST_PORT
  export HOST_PORT
else
  echo "HOST_PORT is set to '$HOST_PORT'";
fi

# Run the Docker container using the published image
docker run --rm -d -p $HOST_PORT:$DOCKER_INTERNAL_PORT --name "$DOCKER_IMAGE" "$DOCKER_IMAGE"

# Exit the script
exit 0