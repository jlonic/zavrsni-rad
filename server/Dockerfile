FROM node:21.7.2

# required for charts api
RUN apt-get update && \
    apt-get install -y python3 python3-pip python3-venv && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*


WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install


# required for charts api
RUN python3 -m venv /usr/src/app/venv
RUN /usr/src/app/venv/bin/pip install billboard.py

COPY . .

EXPOSE 5000
CMD ["node", "index.js"]
