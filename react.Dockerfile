FROM node:16.18-alpine
WORKDIR /app
COPY ./frontend/package.json .
COPY ./frontend/yarn.lock .
RUN yarn install
EXPOSE 5173
CMD ["yarn", "dev", "--host"]