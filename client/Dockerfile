FROM node:20-alpine

WORKDIR /client
COPY . /client/

RUN npm install --legacy-peer-deps
RUN npm run build

CMD ["npm", "run", "preview", "--", "--host"]