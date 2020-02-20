# WSL_website
## Required installations:
```
> npm install express
> npm install mysql
> npm install body-parser
> npm install formidable
> npm install cors
> npm install nodemon
```
### Go to the Gooru_portal folder
```
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
## Rasa installation:
```
> pip3 install rasa
> pip install -U spacy
> python -m spacy download en_core_web_md
> python -m spacy link en_core_web_md en
```
## For rasa Chatbot
```
> rasa run actions
```

### open antoher terminal and execute the following commands
```
> rasa train
> rasa run -m models --enable-api --cors "*" --debug
```


