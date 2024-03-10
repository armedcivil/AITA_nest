FROM node:18.19

RUN apt-get update && apt-get install -y \
    default-mysql-client vim;

WORKDIR /var/www
CMD ["npm", "run", "start:dev"]