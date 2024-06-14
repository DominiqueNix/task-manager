FROM node:18-alpine

COPY . /app

WORKDIR /app

RUN npm install

EXPOSE 4000

CMD [ "npm", "run", "dev" ]