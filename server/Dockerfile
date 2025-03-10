FROM node:21.7.2

# required for charts api
RUN apt-get update && \
    apt-get install -y software-properties-common && \
    add-apt-repository ppa:deadsnakes/ppa && \
    apt-get update && \
    apt-get install -y python3.8 python3.8-venv python3.8-dev python3.8-pip && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*


WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install


# required for charts api
RUN python3.8 -m venv /usr/src/app/venv
RUN /usr/src/app/venv/bin/pip install --upgrade pip
RUN /usr/src/app/venv/bin/pip install billboard.py

COPY . .

EXPOSE 5000
CMD ["node", "index.js"]
