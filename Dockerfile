FROM node:latest

WORKDIR /screen-ai

COPY package.json package-lock.json
COPY . /screen-ai

RUN npm install
RUN npm run docs:embed

EXPOSE 3000

CMD ["npm", "run", "dev"]