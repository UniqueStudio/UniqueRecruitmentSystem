# Unique Recruitment Dashboard

## Description

Unique Recruitment System is the integrated project to solve the problem of the complicated recruitment process in Unique Studio.

There are two parts of Unique Recruitment System,
one is [Dashboard (this repo)](https://github.com/UniqueStudio/UniqueRecruitmentDashboard),
the other is [Form](https://github.com/UniqueStudio/UniqueRecruitmentForm).

## Features

1. Automatic interview / stay-up-test / rejected notification, time selection and so on.
2. Data preserving and visualization
3. Authority management
4. ...

## Preview

![Preview image](./src/image/preview.png)

## Toolchain (possibly will be changed)

1. `TypeScript`
2. `React`
3. `Redux`
4. `Material UI`
5. `Parcel`
6. ...

## TODOS

1. WeChat authorization and login
2. Interface

    1. data displaying
    2. candidates info

        1. draggable multi-column interface
        2. send notification
        3. comment on candidates
        4. ...

    3. new recruitment
    4. ...

3. Logic

    1. get data from server

        1. past recruitment
        2. candidate info
        3. ...

    2. post data to server

        1. new recruitment
        2. SMS
        3. pass or reject candidate
        4. ...

    3. [Operational transformation algorithm](https://en.wikipedia.org/wiki/Operational_transformation) (?)
    4. template parameters of SMS (?)
    5. ...