# UNIQUE RECRUITMENT BACKEND

backend of recruitment system for Unique Studio

## Tech Stack

* `Node.js` + `TypeScript`
* `Postgres` + `Typeorm`
* `Nest` + `Express`
* `Socket.IO`
* `JWT` for authentication

## Documentation

Please run `yarn start` to generate the documentation, then visit `/api`.

## Migrate data from v2

1. export data from mongo
```shell
mongoexport --uri="uri://to/recruitment" --jsonArray --collection=candidates --out=candidates.json
mongoexport --uri="uri://to/recruitment" --jsonArray --collection=recruitments --out=recruitments.json
mongoexport --uri="uri://to/recruitment" --jsonArray --collection=users --out=users.json
```
2. move these jsons to `./backup`
3. run `yarn migrate`
