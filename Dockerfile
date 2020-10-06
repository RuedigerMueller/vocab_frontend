FROM node:12-alpine as builder

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
RUN npm run build-docker


FROM nginx:alpine

COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy from the stahg 1
COPY --from=builder /app-ui/dist /usr/share/nginx/html

#App will be on port 8080
EXPOSE 4200 80

# Run the app 
ENTRYPOINT ["nginx", "-g", "daemon off;"]