const { conn } = require("../db/connection");

module.exports = class MovieService {
	async upsertMovie(payload, callback) {
		conn.query(
			"SELECT * FROM movie WHERE title like $1 ",
			['%' + payload.title + '%'],
			(err, result) => {
				if (err) {
					return callback(err, null);
				}

				if (result.rowCount === 0) {
					conn.query(
						"INSERT INTO movie(title, description, durations, yearrelease, movielang) VALUES($1, $2, $3, $4, $5) RETURNING id",
						[
							payload.title,
							payload.description,
							payload.durations,
							payload.yearrelease,
							payload.movielang,
						],
						(err, res) => {
							if (err) {
								return callback(err, null);
							}

							return callback( null, res);
						}
					);
				}else{
					conn.query(
						"UPDATE movie Set title = $1, description = $2, durations= $3, yearrelease = $4, movielang = $5 where id = $6 RETURNING id",
						[
							payload.title,
							payload.description,
							payload.durations,
							payload.yearrelease,
							payload.movielang,
							result.rows[0].id,
						],
						(err, res) => {
							if (err) {
								return callback(err, null);
							}
							return callback(null, res.rows[0].id);
						}
					);
				}
			}
		);
	}

	async getMovie(callback) {
		conn.all("SELECT * FROM Token", (err, results) => {
			if (err) {
				return callback(err, null);
			}

			return callback(null, results);
		});
	}
};
