# Unique Recruitment Form

## Description

Unique Recruitment System is the integrated project to solve the problem of the complicated recruitment process in Unique Studio.

There are two parts of Unique Recruitment System,
one is [Form (this repo)](https://github.com/UniqueStudio/UniqueRecruitmentForm),
the other is [Dashboard](https://github.com/UniqueStudio/UniqueRecruitmentDashboard).

## Features

1. Simple and beautiful recruitment form which is independent from recruitment website and official website
2. Return receipt form in which candidates can select interview / stay-up-test time

## Toolchain (possibly will be changed)

1. `TypeScript`
2. `React`
3. `Redux` (?)
4. `Parcel`
5. `Sass` (?)
6. `Material UI` (?)
7. ...

## TODOS

1. Interface

    1. Recruitment form
    2. Return receipt form

2. Logic

    1. server should generate different form by `formID` and `userId` in url
    2. send verification code by SMS and verify it
    3. change candidate info by multiple applies
    4. select time
    5. post data to server