FROM node:6.9.1

EXPOSE 3000

ENV NODE_ENV=production

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
RUN npm i

COPY index.js /usr/src/app
COPY src /usr/src/app/src
COPY config /usr/src/app/config

CMD npm start
