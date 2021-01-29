const { conn } = require("../db/connection");

module.exports = class ActorService {
	async getActor(payload) {
		return new Promise((resolve) => {
			conn.query(
				"SELECT * FROM actor where actorname = $1",
				[payload.actorName],
				async (err, result) => {
					if (err) {
						resolve(err);
					}

					//if actor didn't exist upsert new actor
					if (result.rows.length === 0) {
						console.log("actor didnt exist");
						const result = await this.upsertActor(payload);
						console.log("result = ", result);
						resolve(result);
					}
					//return actor Id if actor exist
					resolve(result.rows[0].id);
				}
			);
		});
	}

	//payload = id, actorname, username that login
	async upsertActor(payload) {
		return new Promise((resolve) => {
			const current = new Date().toLocaleDateString("en-GB", {
				year: "numeric",
				month: "short",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			});

			if (!payload.id) {
				conn.query(
					`INSERT INTO actor (actorname) VALUES($1)  RETURNING id`,
					[payload.actorName],
					(err, res) => {
						if (err) {
							resolve(err);
						}
						resolve(res.rows[0].id);
					}
				);
			} else {
				conn.query(
					"UPDATE actor Set actorName = $1, edited_at = $2, edited_by= $3 where id = $4 ",
					[payload.actorname, current, payload.username, payload.id],
					(err, res) => {
						if (err) {
							resolve(err);
						}

						resolve(res);
					}
				);
			}
		});
	}
};
