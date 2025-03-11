#!/bin/bash

# Update the package list and install Python 3 and pip
apt-get update
apt-get install -y python3 python3-dev python3-pip

# Install required Python libraries
pip3 install billboard.py