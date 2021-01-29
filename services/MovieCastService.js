const { conn } = require("../db/connection");

module.exports = class MovieCastService {
	async insertMovieCast(payload) {
		return new Promise(resolve => {
			conn.query(
				"SELECT * FROM movie_cast WHERE movie_id = $1 AND actor_id = $2",
				[payload.movieid, payload. actorid],
				(err, result) => {
					if (err) {
						resolve(err, null);
					}
	
					if (result.rowCount === 0) {
						conn.query(
							"INSERT INTO movie_cast(movie_id, actor_id) VALUES($1, $2)",
							[
								payload.movieid,
								payload.actorid,
							],
							(err) => {
								if (err) {
									resolve(err);
								}
	
								resolve("Movie Inserted" );
							}
						);
					}
	
					resolve( "Movie and Actor already linked" );
				}
			);
		})
	}

	async deleteMovieCast(payload, callback) {
		conn.query(
			"SELECT * FROM movie_cast WHERE movie_id = $1 AND actor_id = $2",
			[payload.movieid, payload. actorid],
			(err, result) => {
				if (err) {
					return callback(err, null);
				}

				if (result.rowCount > 0) {
					conn.query(
						"DELETE FROM movie_cast where movie_id= $1 , actor_id = $2 ",
						[
							payload.movieid,
							payload.actorid,
						],
						(err) => {
							if (err) {
								return callback(err, null);
							}

							return callback( null, "Movie Deleted" );
						}
					);
				}

				return callback( null, "Movie didnt have that actor as the cast" );
			}
		);
	}
}