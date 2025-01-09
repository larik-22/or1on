FROM node:20-alpine

WORKDIR /server
COPY . /server/

RUN npm install

EXPOSE 5000

CMD ["npm", "run", "start"]