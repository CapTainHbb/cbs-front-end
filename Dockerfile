# Frontend/Dockerfile
FROM node:18 as build

WORKDIR /react

# Install dependencies
COPY package*.json ./
RUN npm install --force

# Copy source code and build
COPY . .
RUN npm run build:prod

