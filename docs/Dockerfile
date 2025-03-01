#-----------------------------------------------------------------------------------------------------------------------
# Option 1: Use the default configuration
#-----------------------------------------------------------------------------------------------------------------------
# - the image is based on the latest Node LTS version
# - the latest Quiz Mate version is used
# - the HTTP server runs on port 8080 (inside Docker - can be mapped to any port on the host)
# - HTTPS is disabled (and can't be enabled)
# - static assets are served locally/from Docker
#-----------------------------------------------------------------------------------------------------------------------
#
#   1. Build the Docker image:
#      curl --silent https://david-04.github.io/quiz-mate/Dockerfile | docker build -t quiz-mate -
#
#   2. Run the application (replace "80" with the preferred host port to bind to)
#      docker run --rm -it -p 80:8080 quiz-mate
#
#-----------------------------------------------------------------------------------------------------------------------
# Option 2: Customize the default configuration (limitation: can't enable HTTPS)
#-----------------------------------------------------------------------------------------------------------------------
#
#   Follow the steps above and pass build arguments to "docker build" (to permanently change the configuration):
#
#      --build-arg http_port=8080 .................. HTTP server port (inside the Docker container)
#      --build-arg node_image_version=lts-alpine ... Node image version tag (e.g. "22-alpine3.21")
#      --build-arg quiz_mate_version=latest ........ Quiz Mate version to install (e.g. "1.1.2")
#      --build-arg static_assets_source=local ...... From where to serve static assets ("local", "github" or a URL)
#
#   ...and/or pass environment variables to "docker run" to override the image's configuration on a case-by-case basis:
#
#      -e HTTP_PORT=3000 ........................... HTTP server port (inside the Docker container)
#      -e STATIC_ASSETS_SOURCE=github .............. From where to serve static assets ("local", "github" or a URL)
#
#-----------------------------------------------------------------------------------------------------------------------
# Option 3: Maintain the configuration on the host/outside of Docker (allows enabling HTTPS)
#-----------------------------------------------------------------------------------------------------------------------
#
#   1. Build the Docker image:
#      curl --silent https://david-04.github.io/quiz-mate/Dockerfile | docker build -t quiz-mate -
#
#   2. Mount a local config directory into the container and when running the application:
#      docker run --rm -it -p 80:8080 --volume .:/config quiz-mate
#
#   The example above mounts the the current directory (".") into the Docker container. When the application starts, it
#   creates the configuration file "quiz-mate.cfg" in this directory (unless it already exists). The configuration file
#   The configuration file can then be modified locally on the host. All changes require a restart of the application.
#-----------------------------------------------------------------------------------------------------------------------

ARG node_image_version=lts-alpine
FROM node:${node_image_version}

ARG quiz_mate_version=latest
ARG http_port="8080"
ARG static_assets_source=local

RUN addgroup quiz-mate \
 && adduser --disabled-password --gecos "" --home "/home/quiz-mate" --ingroup "quiz-mate" quiz-mate \
 && mkdir -p /config \
 && chown -R quiz-mate:quiz-mate /config

USER quiz-mate

WORKDIR /home/quiz-mate

RUN touch /config/.is-docker-image \
  && npm install quiz-mate@${quiz_mate_version} \
  && touch run.sh && chmod +x run.sh \
  && cat >run.sh <<EOF

cd /config

if [[ ! -f "/config/quiz-mate.cfg" ]]; then
    echo "#-----------------------------------------------------------------------------------------------------------------------" >> /config/quiz-mate.cfg
    echo "# The port to serve unencrypted HTTP traffic. The HTTP standard port is 80. On UNIX systems, all ports below 1024 are"    >> /config/quiz-mate.cfg
    echo "# privileged. Either run the Quiz Mate as superuser (via sudo) or use a non-standard port (e.g. 8080). To disable HTTP,"  >> /config/quiz-mate.cfg
    echo "# leave the value empty or comment out the whole line."                                                                   >> /config/quiz-mate.cfg
    echo "#-----------------------------------------------------------------------------------------------------------------------" >> /config/quiz-mate.cfg
    echo ""                                                                                                                         >> /config/quiz-mate.cfg
    echo "http-port = \${HTTP_PORT:-${http_port}}"                                                                                  >> /config/quiz-mate.cfg
    echo ""                                                                                                                         >> /config/quiz-mate.cfg
    echo "#-----------------------------------------------------------------------------------------------------------------------" >> /config/quiz-mate.cfg
    echo "# The port and certificate/private key files for serving encrypted HTTPS traffic. The HTTPS standard port is 443. The"    >> /config/quiz-mate.cfg
    echo "# private key file must be unencrypted. To disable HTTPS, leave all values empty or comment out all lines."               >> /config/quiz-mate.cfg
    echo "#-----------------------------------------------------------------------------------------------------------------------" >> /config/quiz-mate.cfg
    echo ""                                                                                                                         >> /config/quiz-mate.cfg
    echo "https-port ="                                                                                                             >> /config/quiz-mate.cfg
    echo "https-cert-file ="                                                                                                        >> /config/quiz-mate.cfg
    echo "https-key-file ="                                                                                                         >> /config/quiz-mate.cfg
    echo ""                                                                                                                         >> /config/quiz-mate.cfg
    echo "#-----------------------------------------------------------------------------------------------------------------------" >> /config/quiz-mate.cfg
    echo "# The main index.html file is always served from the Quiz Mate server itself. Other assets (like JavaScript and CSS)"     >> /config/quiz-mate.cfg
    echo "# can be served from a different location. This offloads a significant proportion of network traffic to another server."  >> /config/quiz-mate.cfg
    echo "# It can reduce charges for outbound network traffic when hosting the Quiz Mate in cloud environments like AWS. It's"     >> /config/quiz-mate.cfg
    echo "# also useful when running the Quiz Mate locally at home on an internet connection with limited upstream capacity. Set"   >> /config/quiz-mate.cfg
    echo "# this property to one of the following:"                                                                                 >> /config/quiz-mate.cfg
    echo "#"                                                                                                                        >> /config/quiz-mate.cfg
    echo "#   - local             Serve assets from the local Quiz Mate server. This is the default."                               >> /config/quiz-mate.cfg
    echo "#   - github            Serve assets from the Quiz Mate GitHub repository. This an easy way to offload network traffic"   >> /config/quiz-mate.cfg
    echo "#                       to a preconfigured web server. This method might (!) stop working if and when the Quiz Mate"      >> /config/quiz-mate.cfg
    echo '#                       GitHub repository is archived or deleted. If so, just switch back to "local".'                    >> /config/quiz-mate.cfg
    echo "#   - http(s)://...     Serve assets from your own web server or a content delivery network. Upload all files and"        >> /config/quiz-mate.cfg
    echo "#                       subdirectories from node_modules/quiz-mate/frontend to your webserver and set the property to"    >> /config/quiz-mate.cfg
    echo "#                       the public URL. When upgrading to a newer Quiz Mate version, all files must be re-uploaded."      >> /config/quiz-mate.cfg
    echo "#-----------------------------------------------------------------------------------------------------------------------" >> /config/quiz-mate.cfg
    echo ""                                                                                                                         >> /config/quiz-mate.cfg
    echo "static-assets-source = \${STATIC_ASSETS_SOURCE:-${static_assets_source}}"                                                 >> /config/quiz-mate.cfg
fi

if [[ -f "/config/.is-docker-image" ]]; then
    echo "------------------------------------------------------------------------------------------------------------------------"
    echo "Configuration"
    echo "------------------------------------------------------------------------------------------------------------------------"
    echo ""
    grep -vE '^[ \t]*(#.*)?$' /config/quiz-mate.cfg | grep -vE '^[^=]*=[ \t]*$'
    echo ""
    echo "------------------------------------------------------------------------------------------------------------------------"
    echo "Starting Quiz Mate..."
    echo "------------------------------------------------------------------------------------------------------------------------"
    echo ""
fi

/home/quiz-mate/node_modules/.bin/quiz-mate

EOF

EXPOSE ${http_port}

ENTRYPOINT [ "/bin/sh", "/home/quiz-mate/run.sh"]
