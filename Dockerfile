# Use official Node.js image
FROM node:22 as builder

# Set working directory
WORKDIR /app

# Copy package.json and lock file
COPY package.json package-lock.json ./

# Install dependencies (including native modules)
RUN npm install --legacy-peer-deps

# Copy the rest of the application
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the NestJS app
RUN npm run build

# Production image
FROM node:22 as production

WORKDIR /app

# Copy only required files from the builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./ 
COPY --from=builder /app/prisma ./prisma

CMD npx prisma migrate deploy && node dist/main
