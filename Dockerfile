FROM node:20-alpine3.17 AS base

FROM base as development
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["sh", "-c", "npm run start:dev"]

FROM base as staging
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
CMD ["sh", "-c", "npm run start:prod"]

FROM base as production
WORKDIR /app
COPY --from=staging /app/dist ./dist
COPY --from=staging /app/package.json /app/package-lock.json ./
RUN npm install --production
EXPOSE 2500
CMD ["sh", "-c", "npm run start:prod"]
