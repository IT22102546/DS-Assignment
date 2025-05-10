# Use an official Node.js image as the base
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to install dependencies
COPY package.json package-lock.json /app/

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . /app/

# Copy the .env file into the container
COPY .env /app/.env

# Expose the port the app will run on
EXPOSE 4005

# Command to run the app
CMD ["npm", "start"]
