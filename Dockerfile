###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine As development

RUN apk add --no-cache python3 make g++

WORKDIR /usr/src/app

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
RUN \
    if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
    elif [ -f package-lock.json ]; then npm ci --force; \
    elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i; \
    else yarn install; \
    fi

COPY --chown=node:node . .

USER node

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine As build

RUN apk add --no-cache python3 make g++
RUN npm install -g @nestjs/cli

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .

# Install all dependencies including dev dependencies
RUN yarn install --frozen-lockfile --verbose

RUN yarn prisma:generate
RUN yarn build

ENV NODE_ENV production

USER node

###################
# PRODUCTION
###################

FROM node:18-alpine As production

RUN apk add --no-cache python3 make g++

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/prisma ./prisma
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# Rebuild bcrypt to ensure it works in the current environment
RUN npm rebuild bcrypt --build-from-source

CMD [ "node", "dist/src/main.js" ]
