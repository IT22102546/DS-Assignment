FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to install dependencies
COPY package.json package-lock.json /app/

# Install dependencies
RUN npm install

# Copy the rest of your application code (this should include the 'api' folder)
COPY . /app/

# Expose the port the app will run on
EXPOSE 4001

# Command to run the app
CMD ["npm", "start"]
