# Use the official Node image as a parent image
FROM node:14

# Set the working directory
WORKDIR /app

# Copy only package.json and package-lock.json first
COPY package*.json ./

# Install dependencies with cache optimization
RUN --mount=type=cache,target=/app/node_modules \
    npm install

# Copy the rest of the application code
COPY . .

# Build the app
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the app
CMD ["npm", "start"]
