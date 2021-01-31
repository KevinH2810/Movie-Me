const { conn } = require("../db/connection");

module.exports = class ActorService {
	async getGenres(payload, callback) {
		conn.query(
			"SELECT id, genrename FROM genre ORDER BY id LIMIT $1 OFFSET (($2 - 1) * $1) ",
			[payload.limit, payload.page],
			async (err, result) => {
				if (err) {
					return callback(err, null);
				}

				return callback(null, result);
			}
		);
	}

	async getGenre(id, callback) {
		conn.query(
			"SELECT id, genrename FROM genre where id = $1",
			[id],
			async (err, result) => {
				if (err) {
					return callback(err, null);
				}
				//return actor Id if actor exist
				return callback(null, result.rows);
			}
		);
	}

	async getGenresbyName(payload) {
		return new Promise((resolve, reject) => {
			conn.query(
				"SELECT id, genrename FROM genre where genrename like $1",
				["%" + payload.genreName + "%"],
				async (err, result) => {
					if (err) {
						reject(new Error(err));
					}

					//if genre didn't exist insert new genre
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

	async addGenreViewedCount(genreid) {
		return new Promise((resolve, reject) => {
			conn.query(
				"UPDATE genre Set viewed = viewed + 1 where id = $1 RETURNING *",
				[genreid],
				(err, res) => {
					if (err) {
						reject(new Error(err));
					}
					resolve(res.rows);
				}
			);
		});
	}

	//payload = id, username, username that login
	async insertGenre(payload, callback) {
		console.log(payload)
		conn.query(
			`insert into genre (genrename)
				select  $1::text
				where not exists (
						select * from genre where genrename = $1
				) 
				RETURNING id`,
			[payload.genreName],
			(err, res) => {
				if (err) {
					return callback(err, null);
				}

				if (res.rowCount === 0) {
					return callback(
						null,
						`genre with name ${payload.genreName} already exists`
					);
				}

				return callback(null,res.rows);
			}
		);
	}

	async getMostViewedGenre(callback) {
		conn.query(
			`SELECT genrename 
			FROM genre a 
			INNER JOIN (select MAX(viewed) as viewed from genre) b on a.viewed = b.viewed)`,
			(err, results) => {
				if (err) {
					return callback(err, null);
				}

				return callback(null, results);
			}
		);
	}

	async updateGenreDetail(payload, callback) {
		conn.query(
			"UPDATE genre Set genrename = $1 where id = $2 RETURNING id",
			[payload.genreName, payload.id],
			(err, res) => {
				if (err) {
					return callback(err, null);
				}
				return callback(null, res.rows);
			}
		);
	}

	async deleteGenre(payload, callback) {
		conn.query(
			"DELETE FROM genre where id = $1 OR genrename like $2",
			[payload.id, "%" + payload.genreName + "%"],
			(err, res) => {
				if (err) {
					return callback(err, null);
				}
				return callback(null, res);
			}
		);
	}

	async getMostViewedGenre(callback) {
		conn.query(
			`SELECT genre.id ,genre.genrename , genre.viewed 
			FROM genre genre 
			INNER JOIN (select MAX(viewed) as viewed from genre) b on genre.viewed = b.viewed 
			`,
			(err, results) => {
				if (err) {
					return callback(err, null);
				}

				return callback(null, results);
			}
		);
	}
};
