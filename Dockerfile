ARG base_image_tag="lts-alpine"

FROM node:${base_image_tag}

ARG http_port="8080"
ENV PUBLIC_URL=""

RUN mkdir -p /home/node/app/node_modules /config && \
    chown -R node:node /home/node/app /config && \
    echo "/home/node/app/node_modules/.bin/quiz-mate /config/quiz-mate.conf" > /entrypoint.sh && \
    chmod +x /entrypoint.sh

USER node
WORKDIR /home/node/app

RUN npm install quiz-mate

RUN cat >/config/quiz-mate.conf <<EOF
http-port = ${http_port}
static-assets-source = local
EOF

EXPOSE ${http_port}
VOLUME /config

ENTRYPOINT [ "/bin/sh", "/entrypoint.sh" ]
