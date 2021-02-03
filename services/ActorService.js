const { conn } = require("../db/connection");

module.exports = class ActorService {
	async getActors(payload, callback) {
		conn.query(
			`
				SELECT id, actorname 
				FROM actor 
				ORDER BY id
				LIMIT $1 OFFSET (($2 - 1) * $1)
				`,
			[payload.limit, payload.page],
			async (err, result) => {
				if (err) {
					return callback(err, null);
				}

				//return actor Id if actor exist
				return callback(null, result);
			}
		);
	}

	async getActor(id, callback) {
		conn.query(
			"SELECT id, actorname FROM actor where id = $1",
			[id],
			async (err, result) => {
				if (err) {
					return callback(err, null);
				}

				return callback(null, result);
			}
		);
	}

	async getActorbyActorName(payload) {
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
						this.insertActor(payload, (err, res) => {
							resolve(result)
						});
					}else{
						//return actor Id if actor exist
					resolve(result.rows[0].id);
					}
				}
			);
		});
	}

	//payload = id, actorname, username that login
	async insertActor(payload, callback) {
		conn.query(
			`insert into actor (actorname)
			select $1::text
			where not exists (
					select actorname from actor where actorname = $1
			) RETURNING *`,
			[payload.actorName],
			(err, res) => {
				if (err) {
					return callback(err, null)
				}

				if(res.rowCount === 0){
					return callback(`Actor with name ${payload.actorName} already exists`, null);
				}else{
					return callback(null, res)
				}
			}
		);
	}

	async updateActorDetail(payload, callback) {
		conn.query(
			"UPDATE actor Set actorname = $1 where id = $2 RETURNING id",
			[payload.actorName, payload.id],
			(err, res) => {
				if (err) {
					return callback(err, null);
				}
				return callback(null, res.rows);
			}
		);
	}

	async deleteActor(actorid, callback) {
		conn.query("DELETE FROM actor where id = $1", [actorid], (err, res) => {
			if (err) {
				return callback(err, null);
			}
			return callback(null, res);
		});
	}
};
