# Use an appropriate base image for Node.js
FROM node:14-alpine

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the source code
COPY . .

# Build the React app
RUN npm run build

ENV PORT=3000

# Expose the port on which the React app will run
EXPOSE $PORT
# Command to run the application
CMD ["npm", "start"]

