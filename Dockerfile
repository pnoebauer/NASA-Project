FROM node:lts-alpine

WORKDIR /app

# copy project folder to WORKDIR
COPY . .

RUN npm install --only=production

RUN npm run build --prefix client

USER node

CMD [ "npm", "start", "--prefix", "server" ]

EXPOSE 8000