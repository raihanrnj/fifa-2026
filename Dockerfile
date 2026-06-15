FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package config files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Build the React frontend static site
RUN npm run build

# Expose the port where the backend runs
EXPOSE 5001

# Set environment variables for Express to serve the built index.html
ENV PORT=5001
ENV NODE_ENV=production

# Start the Express server
CMD ["node", "server.js"]
