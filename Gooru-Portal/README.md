# Navigated Learning Portal
UI Interface for Navigated Learning in Enterprise.

## Installing Dependencies
``` 
> npm install express
> npm install mysql
> npm install body-parser
> npm install formidable
> npm install cors
> npm install nodemon

> pip3 install -r requirements.txt
```
## Mysql Database Steps
```
Open Mysql Console and then run the below command
> source wsl.sql;
```
## Running the project
```
Make changes for username,password for sql access inside server.js accordingly, then run the below step.
> nodemon server.js
```
__Servers at port 5555__

## Steps for uploading your own resource
```
Use this command for testing upload for competency map and path.
curl -i -X POST -H "Content-Type: multipart/form-data" -F "competency=@<location of map.csv>" -F "lpath=@<location of path.csv>" http://localhost:5555/uploadresource
```

## Building Docker
```
> docker-compose up
```

## Running pre-built Docker
```
> docker pull
> docker run
```

## Maintainer
1. Puneeth
2. Rohit
3. Prakhar
