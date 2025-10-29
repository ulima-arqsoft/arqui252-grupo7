FROM node:20

WORKDIR /app
COPY package.json tsconfig.json ./
RUN npm install
COPY . .
RUN npm install --save-dev @types/node
RUN npm run build

CMD ["npm", "start"]