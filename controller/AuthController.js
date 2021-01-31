const {AuthService} = require("../services")
const BaseController = require('./BaseController');
const HandleError = require('./HandleError');
const { conn } = require('../db/connection');
const md5 = require('md5')
const jwt = require('jsonwebtoken');
const config = require('../config/config');

module.exports = class AuthController extends BaseController {
    constructor() {
        super(new AuthService());
      }

    async register(req, res) {
        const { username, password, email, role } = req.body;
        const handleError = new HandleError();

        this.service.register({ username, password, email, role },(err, result) =>{
            if (err) {
                handleError.sendCatchError(res, err);
                return;
            }

            return this.sendSuccessResponse(res, {
				status: 200,
				message: "Register Success",
			});
        })
    }

    async login(req, res) {
        const handleError = new HandleError();
        const { username, email, password } = req.body;

        if(!username && !email){
            handleError.sendCatchError(res, `field username or email must be supplied`);
            return;
        }

        this.service.login({username, email} ,async(err, result) => {
            
            if (err) {
                handleError.sendCatchError(res, err);
                return;
            }

            if (result.length === 0) {
                return this.sendCreatedResponse(res, {
                    status: 206,
                    message: "there is no user associated with the username or email",
                });
            }

            if (result !== 0 && md5(password) !== result.rows[0].password) {
                return this.sendCreatedResponse(res, {
                    status: 204,
                    message: "Password does not matched with associated email or username",
                });
            }

            // create a token
            var tokens = jwt.sign({ userid: result.rows[0].id,username: result.rows[0].username, password: result.rows[0].password, role: result.rows[0].userrole }, config.token.secret, {
                expiresIn: 86400 // expires in 24 hours
            })

            return this.sendSuccessResponse(res, {
				status: 200,
                message: "Register Success",
                token: tokens,
			});
        })
    }
}