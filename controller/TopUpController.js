const BaseController = require('./BaseController');
const HandleError = require('./HandleError');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

const { conn } = require('../db/connection');
const TokenController = require("./MovieController")

module.exports = class TopUpController extends BaseController {

    async AddMoney(req, res) {
        const { username, amount } = req.query
        const handleError = new HandleError();

        conn.run("UPDATE user SET balance = balance + ? WHERE username = ?", [amount, username], (err) => {

            if (err) {
                handleError.sendCatchError(res, err);
                return;
            }

            conn.run(`INSERT INTO topupTransaction(userid,amount) Select userid, ? from user where username = ?`, [amount, username], function(err) {
                if (err) {
                    handleError.sendCatchError(res, err);
                    return;
                }

                res.json({
                    "status": 200,
                    "message": "topup success",
                })
                return;
            })

        })
    }

    async substractMoney(req, res) {
        const { amount, username } = req.query
        conn.run("UPDATE user SET balance = balance - ? WHERE username = ?", [amount, username], (err) => {

            if (err) {
                handleError.sendCatchError(res, err);
                return;
            }

            return new Promise(resolve => {
                conn.run(`INSERT INTO topupTransaction(userid,amount) Select userid, ? from user where username = ?`, [amount, username], function(err) {
                    if (err) {
                        handleError.sendCatchError(res, err);
                        return;
                    }

                    res.json({
                        "status": 200,
                        "message": "topup success",
                    })
                    return;
                })
                resolve()
            })
        })
    }

    async AddAssets(req, res) {
        const handleError = new HandleError();
        const { tokenName, tokenAmount } = req.query
        const tokenController = new TokenController();

        let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }

        if (token) {
            jwt.verify(token, config.token.secret, (err, decoded) => {
                if (err) {
                    return res.json({
                        status: 500,
                        success: false,
                        message: `Token is not valid error = ${err}`
                    });
                } else {
                    conn.get(`SELECT * FROM user WHERE username = ?`, [decoded.username], async(err, result) => {
                        if (err) {
                            handleError.sendCatchError(res, err);
                            return;
                        }

                        if (result.Balance === 0) {
                            return res.json({
                                status: 200,
                                success: false,
                                message: `Your Balance is 0, topup your Balance to continue`
                            });
                        }

                        const selectedToken = await getTokens(tokenName)

                        if (result.Balance < (selectedToken.Price * tokenAmount)) {
                            return res.json({
                                status: 200,
                                success: false,
                                message: `Your Balance is not enough, topup your Balance to continue`
                            });
                        }

                        await insertTopUp(result.userid, selectedToken.Id, tokenAmount, (selectedToken.Price * tokenAmount))
                        await substractBalance((selectedToken.Price * tokenAmount), result.username);
                        await upsertAssets(selectedToken.Id, result.userid, (selectedToken.Price * tokenAmount))

                        return res.json({
                            status: 200,
                            success: false,
                            message: `Assets has been Added`
                        });
                    })
                }
            });
        } else {
            return res.json({
                success: false,
                message: 'Auth token is not supplied'
            });
        }

        function insertTopUp(userid, tokenId, TotalTokenAmount, TotalTokenPrice) {
            return new Promise(resolve => {
                conn.run("INSERT INTO TopUp(UserId, TokenId, TotalToken, TotalPrice) VALUES(?,?,?,?)", [userid, tokenId, TotalTokenAmount, TotalTokenPrice], async(err) => {
                    if (err) {
                        handleError.sendCatchError(res, err);
                        resolve()
                    }
                    resolve()
                })
            })
        }

        function upsertAssets(tokenId, userid, totalAsset) {
            return new Promise(resolve => {
                conn.get("SELECT * FROM Assets WHERE TokenId = ? AND UserId = ?", [tokenId, userid], (err, result) => {
                    if (err) {
                        resolve(err)
                    }

                    if (!result) {
                        conn.run("INSERT INTO Assets(TokenId, UserId, TotalAsset) VALUES(?, ?, ?)", [tokenId, userid, totalAsset], (err) => {
                            if (err) {
                                resolve(err)
                            }

                            resolve()
                        })
                    }

                    conn.run("UPDATE Assets Set TotalAsset = TotalAsset + ? where Id = ? ", [totalAsset, result.Id], (err) => {
                        if (err) {
                            resolve(err)
                        }

                        resolve()
                    })
                })
            })
        }

        function substractBalance(amount, username) {
            conn.run("UPDATE user SET balance = balance - ? WHERE username = ?", [amount, username], (err) => {

                if (err) {
                    handleError.sendCatchError(res, err);
                    return;
                }

                return new Promise(resolve => {
                    conn.run(`INSERT INTO topupTransaction(userid,amount) Select userid, ? from user where username = ?`, [amount, username], function(err) {
                        if (err) {
                            handleError.sendCatchError(res, err);
                            resolve()
                        }
                    })
                    resolve()
                })
            })
        }

        function getTokens(tokenName) {
            return new Promise(resolve => {
                conn.get("SELECT * FROM Token WHERE TokenName = ?", [tokenName], (err, result) => {
                    if (err) {
                        resolve(err)
                    }

                    resolve(result)
                })
            })
        }
    };
}