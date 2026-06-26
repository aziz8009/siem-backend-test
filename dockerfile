# =========================
# Build Stage
# =========================
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# =========================
# Production Stage
# =========================
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./

RUN npm ci --omit=production

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/migrations ./src/migrations
COPY --from=builder /app/src/seeders ./src/seeders
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/.sequelizerc ./.sequelizerc

RUN chmod +x scripts/*.sh   

EXPOSE 3000

CMD ["npm", "start"]