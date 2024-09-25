FROM node:18-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

ENV VITE_API_BASE_URL=http://localhost:5045/api

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]
