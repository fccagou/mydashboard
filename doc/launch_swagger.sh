#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

command="run --rm -d --name mydashboard_swagger -p 8000:8080 -u$(id -u):$(id -g) -e SWAGGER_JSON=/spec_api.yaml -v ${SCRIPT_DIR}/spec_api.yaml:/spec_api.yaml swaggerapi/swagger-ui"

# check if docker is present on the system otherwise use podman instead
if command -v docker > /dev/null
then
    /usr/bin/docker $command
elif command -v podman > /dev/null
then
    /usr/bin/podman $command
else
    echo "Neither docker nor podman are installed on the system"
    exit 1
fi
