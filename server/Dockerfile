FROM alpine:3.12

RUN echo http://mirror.yandex.ru/mirrors/alpine/v3.12/main > /etc/apk/repositories; \
    echo http://mirror.yandex.ru/mirrors/alpine/v3.12/community >> /etc/apk/repositories && \
    apk add \
    nodejs \
    lsof \
    npm && \
    mkdir -p app/src && \
    mkdir -p app/storage && \
    addgroup -S testgroup && \
    adduser -S server -G testgroup && \
    chown -R server:testgroup /app/

USER server

WORKDIR /app
COPY . /app

RUN npm install

EXPOSE 3000

ENTRYPOINT ["npm", "run", "dev"]