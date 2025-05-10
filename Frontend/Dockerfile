# Stage 1: Build
FROM node:18 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

# Copy all files including .env.production
COPY . .

# Make sure your .env.production contains:
# VITE_User_API_URL=http://localhost:32608
# VITE_Admin_API_URL=http://localhost:32469
# etc...

RUN npm run build

# Stage 2: Run
FROM node:18
WORKDIR /app

# Copy built assets and node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Install serve
RUN npm install -g serve

# These environment variables will be available at runtime
ENV VITE_User_API_URL=http://localhost:32608
ENV VITE_Admin_API_URL=http://localhost:32469
ENV VITE_ORDER_API_URL=http://localhost:32709
ENV VITE_PAYMENT_API_URL=http://localhost:31395
ENV VITE_Inventory_API_URL=http://localhost:31587

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]