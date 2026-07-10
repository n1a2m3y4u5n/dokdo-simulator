FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY server/package*.json ./server/
RUN cd server && npm ci --production
COPY server/index.js ./server/

EXPOSE 3001
ENV PORT=3001
CMD ["node", "server/index.js"]
