## Description

Shop App created with Nest, Typeorm and Postgres

## Installation

Create .env in root
Copy .env.example details in .env
Use nvm to instal/select correct version of node

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

#start db in docker container
$ npm run db:start

#stop db in docker container
$ npm run db:stop

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Migrations

```bash
# run migrations
$ npm run migration:run

# revert migrations
$ npm run migration:revert

# automaticaly generate migrations
$ npm run migration:generate

# create new migrations
$ npm run migration:create
```
