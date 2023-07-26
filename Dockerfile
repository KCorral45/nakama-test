FROM node:alpine AS node-builder

# Set a build argument with a random value
ARG CACHEBUST=$(date +%s)	

WORKDIR /backend

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY src/ ./src
RUN npx tsc

FROM registry.heroiclabs.com/heroiclabs/nakama:3.17.0

COPY --from=node-builder /backend/build/*.js /nakama/data/modules/build/
COPY data/my-config.yml /nakama/data/