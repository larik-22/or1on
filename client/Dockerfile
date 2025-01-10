FROM node:20-alpine

WORKDIR /client
COPY . /client/

ENV VITE_BACKEND_URL=http://or1on.city:3000

RUN npm install --legacy-peer-deps
RUN npm run build


CMD ["npm", "run", "preview", "--", "--host"]