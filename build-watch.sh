#!/bin/bash

while inotifywait -e create -r . @dist @node_modules @.git
do
    clear
    npm run build
    sleep 10
    echo
done
