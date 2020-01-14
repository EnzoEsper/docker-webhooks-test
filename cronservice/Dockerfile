FROM node:8.3.0

# Installing the packages needed
RUN apt-get update && apt-get install -y \
  cron \
  rsyslog 

ENV TZ=America/Buenos_Aires
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install && npm cache clean --force

COPY . .

WORKDIR /

COPY ./cron/root /etc/cron.d/root
RUN chmod 0644 /etc/cron.d/root
RUN crontab /etc/cron.d/root

CMD ["cron", "-f"]