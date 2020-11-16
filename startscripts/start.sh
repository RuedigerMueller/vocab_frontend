#!/bin/bash -x

if test $1 = 'build-k8s' ; then 
    echo 'Running on K8S'
    nginx -g 'daemon off;'
else 
    echo 'Running on Heroku'
    sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/nginx.conf  && nginx -g 'daemon off;'
fi