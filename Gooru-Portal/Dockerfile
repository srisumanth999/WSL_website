# Building on top of this base image
FROM python:3.6-slim

# Exposing port where service is running
EXPOSE 5555

# Defining the directory structure inside the container
# Setting current working dir
WORKDIR /usr/app

# Copying relevant files inside container
COPY . /usr/app/

# Installing the requirements inside the container
RUN apt-get update
RUN apt-get install nodejs curl npm -y
RUN apt-get install python3-pip -y
RUN pip3 install pymysql

RUN npm install express
RUN npm install mysql
RUN npm install body-parser
RUN npm install formidable
RUN npm install cors
#RUN npm install nodemon

# CMD ["/bin/sh","run.sh"]
