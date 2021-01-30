const { conn } = require("../db/connection");

module.exports = class ActorService {
	async getActor(payload) {
		return new Promise((resolve, reject) => {
			conn.query(
				"SELECT * FROM actor where actorname like $1",
				["%" + payload.actorName + "%"],
				async (err, result) => {
					if (err) {
						reject(new Error(err));
					}

					//if actor didn't exist upsert new actor
					if (result.rowCount === 0) {
						const result = await this.insertActor(payload);
						resolve(result);
					}
					//return actor Id if actor exist
					resolve(result.rows[0].id);
				}
			);
		});
	}

	//payload = id, actorname, username that login
	async insertActor(payload) {
		return new Promise((resolve, reject) => {
			conn.query(
				`INSERT INTO actor (actorname) VALUES($1) RETURNING id`,
				[payload.actorName],
				(err, res) => {
					if (err) {
						reject(new Error(err));
					}
					resolve(res.rows[0].id);
				}
			);
		});
	}

	async updateActorDetail(payload, callback) {
		conn.query(
			"UPDATE actor Set actorname = $1 where id = $2 RETURNING id",
			[
				payload.genreName,
				payload.genreid
			],
			(err, res) => {
				if (err) {
					return callback(err, null);
				}
				return callback(null, res.rows);
			}
		);
	}

	async deleteActor(actorId, callback){
		conn.query(
			"DELETE FROM actor where id = $1",
			[
				actorId
			],
			(err, res) => {
				if (err) {
					return callback(err, null);
				}
				return callback(null, res);
			}
		);
	}
};
