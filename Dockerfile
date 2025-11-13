# Using Node image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies (copy package.json first for cache)
COPY package*.json ./
RUN npm ci --only=production

# Bundle app source
COPY src ./src
COPY package.json ./

ENV PORT=3000
EXPOSE 3000

# Healthcheck for Docker (curl inside container)
HEALTHCHECK --interval=10s --timeout=3s --retries=5 \
  CMD wget -qO- --tries=1 --timeout=2 http://127.0.0.1:3000/health || exit 1

CMD ["node", "src/server.js"]
