# Backend-login-simple

## How to Usage
```bash
$ git clone git@github.com:KevinH2810/Backend-login-simple.git
# clone the repository from your branch

$ cd Backend-login-simple
# change directory to Backend-login-simple

$ yarn install or npm install
# install dependencies using yarn or npm

$ export SECRET=secretkeyoflogin
# export the secret key to be used to generate JWT token

$ yarn start or npm start
# start the app using yarn or npm
```

## Routes
### available routes on this apps are

```bash
localhost:9099/register
localhost:9099/login
localhost:9099/addMoney
localhost:9099/addAssets
localhost:9099/token
localhost:9099/token/add
```

## Register
---
you can register a new user in here by supplying the username and password.

## Login
---
Used to login and generate the JWTtoken
the token are available for 24 Hours by supplying username and password.

## Add Money
---
Used to add Money to user Balance. 
you can supply username and money, JWT token arent needed because we're assumed the TopUp are added manually

## Token - /
---
Get the list of all available tokens.

## Token - /Add
---
Add New Token by supplying tokenName and tokenPrice

## Add Asset 
---

used to add asset based per user id.

it will insert new data if its a new user or update if already exist.

the transaction history is recorded in respective table.

you can supply tokenName, tokenAmount and JWTtoken as Bearer Token in the header