var md5 = require('md5')
const chalk = require('chalk');
const { conn } = require('./connection')
const Promise = require('promise')

module.exports = class DB {

    init() {
        this.createTableUser()
            .then(this.createTableTopUp())
            .then(this.createTableToken())
            .then(this.createTableAsset())
            .catch(error => {
                console.log(`error = ${error}`)
            })
    }

    createTableUser() {
        return new Promise(resolve => {
            conn.run(`CREATE TABLE "User" (
            "userid"	INTEGER PRIMARY KEY AUTOINCREMENT,
            "username"	TEXT NOT NULL UNIQUE,
            "password"	TEXT NOT NULL,
            "Balance"	REAL DEFAULT 0
        );`,
                (err) => {
                    if (err) {
                        console.log(chalk.green("[Init-DB] - Table User already exist"))
                        return
                    }

                    // Table just created, creating some rows

                    console.log(chalk.green("[Init-DB] - Table Asset User created"))
                    var insert = 'INSERT INTO User (username, password) VALUES (?,?)'
                    conn.run(insert, ["admin", md5("admin123456")])
                    conn.run(insert, ["user", md5("user123456")])

                    resolve()


                })
        })
    }

    createTableTopUp() {
        return new Promise(resolve => {
            conn.run(`
            CREATE TABLE "TopUp" (
                "Id"	INTEGER PRIMARY KEY AUTOINCREMENT,
                "UserId"	INTEGER,
                "TokenId"	INTEGER,
                "TotalToken"	INTEGER,
                "TotalPrice"	REAL,
                "Date"	TEXT DEFAULT (datetime('now','localtime'))
            );`, (err) => {
                if (err) {
                    console.log(chalk.green("[Init-DB] - Table TopUp already exist"))
                    return
                }

                console.log(chalk.green("[Init-DB] - Table TopUp TopUp created"))

                resolve()
            })
        })
    }

    createTableToken() {
        return new Promise(resolve => {
            conn.run(`
        CREATE TABLE "Token" (
            "Id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            "TokenName"	TEXT,
            "Price"	REAL
        );`,
                (err) => {
                    if (err) {
                        console.log(chalk.green("[Init-DB] -  Table Token already exist"))
                        return
                    }

                    console.log(chalk.green("[Init-DB] - Table Token created"))

                    // Table just created, creating some rows

                    var insert = 'INSERT INTO Token (TokenName, Price) VALUES (?,?)'
                    conn.run(insert, ["Token-A", 1.5])
                    conn.run(insert, ["Token-B", 2.73])

                    resolve()
                })

        })
    }

    createTableAsset() {
        return new Promise(resolve => {
            conn.run(`
        CREATE TABLE "Assets" (
            "Id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
            "TokenId"	INTEGER,
            "UserId"	INTEGER,
            "TotalAsset"	REAL
        );`, (err) => {
                if (err) {
                    console.log(chalk.green("[Init-DB] - Table Asset already exist"))
                    return
                }


                console.log(chalk.green("[Init-DB] - Table Asset Asset created"))

                resolve()
            })
        })
    }

    createTableTopUpTransaction() {
        return new Promise(resolve => {
            conn.run(`
            CREATE TABLE "topupTransaction" (
                "id"	INTEGER PRIMARY KEY AUTOINCREMENT,
                "userid"	INTEGER,
                "amount"	REAL,
                "Date"	INTEGER DEFAULT (datetime('now','localtime'))
            );`, (err) => {
                if (err) {
                    console.log(chalk.green("[Init-DB] - Table TopUpTransaction already exist"))
                    return
                }

                console.log(chalk.green("[Init-DB] - Table TopUpTransaction Asset created"))

                resolve()
            })
        })
    }
}