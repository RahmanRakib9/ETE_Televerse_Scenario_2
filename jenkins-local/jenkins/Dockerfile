# jenkins/Dockerfile
FROM jenkins/jenkins:lts

USER root

# Install docker CLI and docker-compose dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    jq && \
    rm -rf /var/lib/apt/lists/*

# Install docker (using docker.io package for simplicity)
RUN apt-get update && \
    apt-get install -y --no-install-recommends docker.io && \
    rm -rf /var/lib/apt/lists/*

# Install docker-compose (v1)
ARG DOCKER_COMPOSE_VERSION=1.29.2
RUN curl -L "https://github.com/docker/compose/releases/download/${DOCKER_COMPOSE_VERSION}/docker-compose-$(uname -s)-$(uname -m)" \
    -o /usr/local/bin/docker-compose && \
    chmod +x /usr/local/bin/docker-compose

# Add jenkins user to docker group
RUN usermod -aG docker jenkins

USER jenkins
