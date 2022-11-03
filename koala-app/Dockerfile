# Stage 1: Compile and Build angular codebase

# Use official node image as the base image
FROM node:18 as build
# Set the working directory
WORKDIR /usr/local/app
# Add the source code to app
COPY ./ /usr/local/app
# Install all the dependencies
RUN npm install
# Generate the build of the application
RUN npx nx build api


FROM node:18-alpine

RUN npm install -g nodemon

WORKDIR /app/api
COPY --from=build /usr/local/app/dist/apps/api /app/api

CMD [ "nodemon", "main.js" ]
