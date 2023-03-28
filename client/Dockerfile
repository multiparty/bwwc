FROM node:18 as build

WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx as prod
# Copy your custom nginx.conf file into the container
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy React Build into html folder
COPY --from=build /app/dist /usr/share/nginx/html
