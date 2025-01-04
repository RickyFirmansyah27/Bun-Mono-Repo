FROM kong:3.1.1-alpine

# # Switch back to root user to install additional packages
USER root

# Install the js-pluginserver
RUN apk update \
    && apk add --update nodejs npm python3 make g++ vim nano \
    && rm -rf /var/cache/apk/*

# Install kong-pdk as root
RUN npm install --ignore-scripts --unsafe -g kong-pdk@0.5.3

# Switch back to kong-user
USER kong

ENV term xterm

#workdir
WORKDIR /usr/local/kong/js-plugins
COPY ./plugins .

USER root
RUN npm install --ignore-scripts

USER kong
