# Use Node.js LTS as the base image
FROM node:lts-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY frontend/package*.json frontend/
COPY backend/package*.json backend/

# Install dependencies
RUN cd frontend && npm install && cd ../backend && npm install

# Copy source files
COPY frontend/ frontend/
COPY backend/ backend/
COPY resources/ resources/
COPY README.md LICENSE CHANGELOG.md ./

# Build frontend
RUN cd frontend && npm run build

# Create dist directory and copy files
RUN mkdir -p dist && \
    cp -r backend/* dist/ && \
    mkdir -p dist/public && \
    cp -r frontend/build/* dist/public/ && \
    cp -r resources dist/ && \
    cp README.md LICENSE CHANGELOG.md dist/

# Create config file
RUN echo "http-port = 3001\n\
https-port = 3002\n\
https-cert-file = resources/sample-ssl-certificate.pem\n\
https-key-file = resources/sample-ssl-private-key.pem\n\
static-assets-source = local" > dist/quiz-mate.cfg

# Set working directory to dist
WORKDIR /app/dist

# Expose ports
EXPOSE 3001
EXPOSE 3002

# Set environment variables
ENV NODE_ENV=production

# Start the application
CMD ["node", "src/main.js"]
