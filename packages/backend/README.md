# UNIQUE RECRUITMENT BACKEND

backend of recruitment system for Unique Studio

## Tech Stack

1. `node.js`
2. `typescript`
3. `postgres`
4. `typeorm`
5. `nest`
6. `socket.io`
7. `jwt`

## Documentation

[Old doc is Here](./docs/doc.md)

For v3, please run `yarn start`, and visit `/api` for the documentation.

## Migrate data from v2

1. export data from mongo
```shell
mongoexport --uri="uri://to/recruitment" --jsonArray --collection=candidates --out=candidates.json
mongoexport --uri="uri://to/recruitment" --jsonArray --collection=recruitments --out=recruitments.json
mongoexport --uri="uri://to/recruitment" --jsonArray --collection=users --out=users.json
```
2. move these jsons to `./backup`
3. run `yarn migrate`
