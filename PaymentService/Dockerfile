# Use Node.js 16 as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies first
COPY package.json package-lock.json /app/

# Install dependencies
RUN npm install

# Copy the rest of the application code into the container
COPY . /app/

# Expose the port that the Payment Service API will run on
EXPOSE 4002

# Command to run the Payment Service
CMD ["npm", "start"]
