FROM node:12-alpine as builder
ENV PORT=8080

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
RUN npm run build


FROM nginx:alpine

# Copy a default nginx.conf -> can be overwritten via ConfigMap
COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy from the stage 1
COPY --from=builder /app-ui/dist /usr/share/nginx/html

#App will be on port 8080
EXPOSE 4200 8080

# Run the app 

# ENTRYPOINT ["nginx", "-g", "daemon off;"]

# Original  working on K8S 
# CMD ["nginx", "-g", "daemon off;"]

# Works for Heroku
# CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/nginx.conf && nginx -g 'daemon off;'

#CMD if test $PLATFORM = 'Heroku' ; then sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/nginx.conf  && nginx -g 'daemon off;'; else nginx -g 'daemon off;'; fi
#PORT environemnt variable will automatically and dynamically be filled by Heroku
#BACKEND_SERVICE_URL environmnet variable has to be maintained for Heroku deployment
#     For sed to work the / has to be entered as \/
#     Example: https:\/\/vocabdockerbackend.herokuapp.com\/backend
#CMD if test $PLATFORM = 'Heroku' ; then sed -i -e 's/$PORT/'"$PORT"'/g; s/$BACKEND_SERVICE_URL/'"$BACKEND_SERVICE_URL"'/' /etc/nginx/nginx.conf  && nginx -g 'daemon off;'; else nginx -g 'daemon off;'; fi
CMD if test $PLATFORM = 'Heroku' ; then sed -i -e 's,$PORT,'"$PORT"',g; s,$BACKEND_SERVICE_URL,'"$BACKEND_SERVICE_URL"',' /etc/nginx/nginx.conf  && nginx -g 'daemon off;'; else nginx -g 'daemon off;'; fi