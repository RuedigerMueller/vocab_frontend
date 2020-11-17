FROM node:12-alpine as builder
ENV PORT=8080
ARG BUILD_SCRIPT=build-k8s

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# If you are building your code for production
# RUN npm ci --only=production
RUN npm install && mkdir /app-ui && mv ./node_modules ./app-ui

WORKDIR /app-ui

# Copy coding and build
COPY . .
RUN npm run $BUILD_SCRIPT


FROM nginx:alpine

# Copy a default nginx.conf -> can be overwritten via ConfigMap
COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy from the stage 1
COPY --from=builder /app-ui/dist /usr/share/nginx/html

#App will be on port 8080
#EXPOSE 4200 8080

# Run the app 

# ENTRYPOINT ["nginx", "-g", "daemon off;"]

# Original  working on K8S 
# CMD ["nginx", "-g", "daemon off;"]

# Works for Heroku
# CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/nginx.conf && nginx -g 'daemon off;'

# COPY ./startscripts/start.sh /startscripts/start.sh
# RUN chmod u+x startscripts/start.sh
# CMD chmod u+x /startscripts/start.sh && /startscripts/start.sh $BUILD_SCRIPT
# CMD startscripts/start.sh $BUILD_SCRIPT

#CMD if test $BUILD_SCRIPT = 'build-k8s' ; then nginx -g 'daemon off;'; else sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/nginx.conf  && nginx -g 'daemon off;'; fi
CMD if test $PLATFORM = 'Heroku' ; then sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/nginx.conf  && nginx -g 'daemon off;'; else nginx -g 'daemon off;'; fi
