const { conn } = require("../db/connection");

module.exports = class ActorService {
	async getGenres(callback) {
		conn.query("SELECT id, genrename FROM genre ", async (err, result) => {
			if (err) {
				return callback(err, null)
			}

			return callback(null, result)
		});
	}

	async getGenresbyid(payload) {
		return new Promise((resolve, reject) => {
			conn.query(
				"SELECT * FROM genre where genrename like $1",
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
					resolve(result.rows);
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
			[payload.genreName, payload.genreid],
			(err, res) => {
				if (err) {
					return callback(err, null);
				}
				return callback(null, res.rows);
			}
		);
	}

	async DeleteGenre(genreId, callback) {
		conn.query("DELETE FROM genre where id = $1", [genreId], (err, res) => {
			if (err) {
				return callback(err, null);
			}
			return callback(null, res);
		});
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
