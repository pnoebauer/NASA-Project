FROM node:lts-alpine

WORKDIR /app

# copy project folder to WORKDIR
# COPY . .
COPY package*.json ./

# run after copy will only run if the files have changed
COPY client/package*.json client/
RUN npm run install-client --only=production

COPY server/package*.json server/
RUN npm run install-server --only=production

COPY client/ client/
RUN npm run build --prefix client

COPY server/ server/

USER node

CMD [ "npm", "start", "--prefix", "server" ]

EXPOSE 8000