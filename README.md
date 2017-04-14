### Server for rent book application (Android)

This server is written by nodejs application, base on template : https://github.com/sahat/hackathon-starter
This template is rewritten and follow ES6 syntax base on **babel** : https://github.com/babel/babel
Some main package is used:
  - express
  - objection
  - knex

#### Installing

  - git clone
  - config file in database knexfile.js and database.js for your requirement.
  - run install npm: npm i
  - run migration: knex migrate:latest --env dev
  - run seed:
  -     knex seed:run --env dev
  - run app:
  -     nodemon app.js

## Enjoy and learning !
