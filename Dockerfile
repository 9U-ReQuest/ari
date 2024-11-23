FROM node:20-alpine as builder

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable && corepack prepare pnpm@latest --activate
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

FROM node:20-alpine as runner

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=builder /app/dist ./dist
COPY package.json pnpm-lock.yaml ./

# Install only production dependencies
RUN pnpm install --prod

EXPOSE 8080

CMD ["node", "dist/index.js"]
