FROM node:12-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# If you are building your code for production
# RUN npm ci --only=production
RUN npm install

# Copy coding and build
COPY . .
RUN npm run build-docker

#App will be on port 8080
EXPOSE 8080

# Run the app 
CMD npm run start