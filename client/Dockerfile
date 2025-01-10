FROM node:20-alpine

WORKDIR /client
COPY . /client/

ARG VITE_BACKEND_URL
ARG VITE_GRASSHOPER_API_KEY

ENV VITE_BACKEND_URL=${VITE_BACKEND_URL}
ENV VITE_GRASSHOPER_API_KEY=${VITE_GRASSHOPER_API_KEY}
RUN npm install --legacy-peer-deps
RUN npm run build


CMD ["npm", "run", "preview", "--", "--host"]