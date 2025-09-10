FROM node:22.19.0

WORKDIR /apps

COPY ./package*.json ./

RUN npm install && npm init -y && npm install express cors dotenv morgan pg

COPY . .

EXPOSE 5000

CMD ["npm", "run" , "dev"]

