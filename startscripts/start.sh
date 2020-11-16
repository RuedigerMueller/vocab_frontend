#!/bin/bash -x

if $1='K8S' ; then 
    nginx -g 'daemon off;'
else 
    sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/nginx.conf  && nginx -g 'daemon off;'
fi