const { conn } = require("../db/connection");

module.exports = class ActorService {
	async getGenre(payload) {
		return new Promise((resolve, reject) => {
			conn.query(
				"SELECT * FROM genre where genrename like $1",
				["%" + payload.genreName + "%"],
				async (err, result) => {
					if (err) {
						reject(new Error(err));
					}

					//if actor didn't exist upsert new actor
					if (result.rows.length === 0) {
						const result = await this.insertGenre(payload);
						resolve(result);
					}
					//return actor Id if actor exist
					resolve(result.rows[0].id);
				}
			);
		});
	}

	//payload = id, actorname, username that login
	async insertGenre(payload) {
		return new Promise((resolve, reject) => {
			conn.query(
				`INSERT INTO genre (genrename) VALUES($1) RETURNING id`,
				[payload.genreName],
				(err, res) => {
					if (err) {
						reject(new Error(err));
					}
					resolve(res.rows[0].id);
				}
			);
		});
	}
};
