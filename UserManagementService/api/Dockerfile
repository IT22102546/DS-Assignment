# Use a minimal Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files first for layer caching
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=4000
ENV NODE_OPTIONS="--experimental-vm-modules --es-module-specifier-resolution=node"

# Optional: Add a non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Healthcheck (make sure your /health endpoint exists)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/health || exit 1

# Expose the application port
EXPOSE 4000

# Start the application
CMD ["node", "index.js"]
