FROM node:20-alpine

WORKDIR /client
COPY . /client/

RUN npm install --legacy-peer-deps

CMD ["npm", "run", "dev", "--", "--host"]