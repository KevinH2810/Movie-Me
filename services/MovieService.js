const { conn } = require("../db/connection");

module.exports = class MovieService {
	async upsertMovie(payload, callback) {
		conn.query(
			"SELECT * FROM Movie WHERE title = $1 ",
			[payload.title],
			(err, result) => {
				if (err) {
					return callback(err, null);
				}

				if (!result) {
					conn.query(
						"INSERT INTO movie(title, description, durations, yearrelease, movielang) VALUES($1, $2, $3, $4, $5)",
						[
							payload.title,
							payload.description,
							payload.durations,
							payload.yearRelease,
							payload.movieLang,
						],
						(err) => {
							if (err) {
								return callback(err, null);
							}

							return callback( null, "Movie Inserted" );
						}
					);
				}

				conn.query(
					"UPDATE movie Set title =  $1, description = $2, durations= $3, yearrelease = $4, movielang = $5 where id = $6 ",
					[
						payload.title,
						payload.description,
						payload.durations,
						payload.yearRelease,
						payload.movieLang,
						payload.id,
					],
					(err) => {
						if (err) {
							return callback(err, null);
						}

						return callback(null, "Movie Updated");
					}
				);
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
