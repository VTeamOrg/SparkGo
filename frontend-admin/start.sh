#!/bin/bash

#default declarations
DOCKER_INTERNAL_PORT=5173
DEF_HOST_PORT=5173
DOCKER_IMAGE="sparkgo_backend"

#check so we have an input to the script
if [ $# -eq 0 ]; then
  echo "No argument provided, proceesing with 'server/data' as the default value"
  path="server/data"
else
  echo "argument '$1' provided as input"
  path="$1"
fi

#check for existance of HOST_PORT
if [ -z ${HOST_PORT+x} ]; then
  echo "HOST_PORT is not defined - setting to $DEF_HOST_PORT";
  HOST_PORT=$DEF_HOST_PORT
  export HOST_PORT
else
  echo "HOST_PORT is set to '$HOST_PORT'";
fi

# Run the Docker container using the published image
docker run --rm -d -p $HOST_PORT:$DOCKER_INTERNAL_PORT --name myserver "$DOCKER_IMAGE"

# Exit the script
exit 0