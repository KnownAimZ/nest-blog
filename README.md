## Description

Shop App created with Nest, Typeorm and Postgres

## Installation

- Create .env in root
- Copy .env.example details in .env
- Use nvm to instal/select correct version of node

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# start db in docker container
$ npm run db:start

# stop db in docker container
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

## Check list
- 1. Регистрация
    1. номер телефона/почта/пароль/имя X (без номера)
    2. регистрация через гугл // второстепенно, можно оставить на потом, в таблице с юзерами иметь пометку как юзер зарегался -
    3. + верификация через почту X
    4. + сброс пароля X
- 2. Авторизация ( Сессии: храним userId + товары которые пользователь добавлял в корзину ) X (не сессии, а JWT)
- 3. Роли пользователей: для начала Админ + Обычный пользователь X
- 4. Админские API ендпоинты: X
    1. Добавление категории товара X
    2. Добавление товара (tittle, description, image, price, category) X (без image)
- 5. Пользовательские API (помимо регистрации/авторизации): X
    1. Получить товары X
    2. Фильтры( по категории, цене, названию) X
    3. Добавить в корзину X
    4. Получить инфо о текущем залогиненом пользователе X
- 6. Не забываем о валидации где это нужно X
- 7. Дефолтный админ добавляется изначально при разворачивании приложения(seed) -
- 8. Каждая таблица в миграции отдельной( в разумной мере) X
- 9. Документация: Swagger или любые другие альтернативы на вкус, включая коллеции в postman X