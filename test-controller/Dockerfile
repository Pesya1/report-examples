# syntax=docker/dockerfile:1

FROM node:16.13.0

WORKDIR /app
ARG GITHUB_TOKEN
COPY ["package.json", "package-lock.json*", "./"]
RUN git config --global url."https://$GITHUB_TOKEN@github".insteadOf "ssh://git@github"
RUN npm install --production
COPY . .
CMD [ "node", "index.js" ]