# Use an official Node.js runtime as a parent image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for layer caching)
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port your app runs on
EXPOSE 4005

# Define environment variables (optional, better to use docker-compose)
ENV NODE_ENV=production

# Start the app
CMD ["node", "Index.js"]
