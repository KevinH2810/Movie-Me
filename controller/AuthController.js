const BaseController = require('./BaseController');
const HandleError = require('./HandleError');
const { conn } = require('../db/connection');
const md5 = require('md5')
const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = class AuthController extends BaseController {

    async register(req, res) {
        const { username, password, email, role } = req.body;
        const handleError = new HandleError();

        conn.query(`INSERT INTO userlogin(username,password, email, userrole) VALUES ($1,$2,$3,$4)`, [username, md5(password), email, role], (err, result) =>{
            if (err) {
                handleError.sendCatchError(res, err);
                return;
            }

            res.json({
                "status": 200,
                "message": "register success",
            })
            return;
        })
    }

    async login(req, res) {
        const { username, password } = req.body;
        const handleError = new HandleError();

        console.log(username)
        conn.query(`SELECT * FROM userlogin WHERE username = $1`, [username], async(err, result) => {
            
            if (err) {
                handleError.sendCatchError(res, err);
                return;
            }

            if (result.length === 0) {
                res.json({
                    "code": 206,
                    "failed": "username does not exist"
                })
                return;
            }

            if (result !== 0 && md5(password) !== result.rows[0].password) {
                res.json({
                    "code": 204,
                    "failed": "password does not match"
                })
                return;
            }

            // create a token
            var tokens = jwt.sign({ userid: result.rows[0].id,username: result.rows[0].username, password: result.rows[0].password, role: result.rows[0].userrole }, config.token.secret, {
                expiresIn: 86400 // expires in 24 hours
            })

            res.json({
                "code": 200,
                "failed": "login succesfull",
                "token": tokens
            })
            return;
        })
    }
}