const { conn } = require("../db/connection");

module.exports = class AuthService {
	async register(payload, callback) {
		conn.query(
			`INSERT INTO userlogin(username,password, email, userrole) VALUES ($1,$2,$3,$4)`,
			[payload.username, md5(payload.password), payload.email, payload.role],
			(err, res) => {
				if (err) {
					return callback(err, null);
				}

				return callback(null, res.rows);
			}
		);
	}

	async login(payload, callback) {
		conn.query(
			`
			SELECT * FROM userlogin WHERE username = $1 OR email = $2`,
			[payload.username, payload.email],
			async (err, result) => {
				if (err) {
					return callback(err, null);
				}

				return callback(null, result.rows);
			}
		);
	}
};
