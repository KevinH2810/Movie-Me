const { conn } = require("../db/connection");

module.exports = class MovieCastService {
	async deleteMovieCastByActorId(payload, callback){
		conn.query(
			`DELETE FROM movie_cast 
			where actor_id = $1`,
			[payload.actorid],
			async (err, result) => {
				if (err) {
					return callback(err, null);
				}

				return callback(null, result);
			}
		);
	}

	async DeleteMovieCastByMovieId(payload){
		return new Promise((resolve, reject) => {
			conn.query(
				`DELETE FROM movie_cast 
				where movie_id = $1`,
				[payload.id],
				async (err, result) => {
					if (err) {
						reject(new Error(err));
					}
	
					resolve(result);
				}
			);
		})
	}

	async insertMovieCast(payload) {
		return new Promise((resolve, reject) => {
			conn.query(
				"SELECT * FROM movie_cast WHERE movie_id = $1 AND actor_id = $2",
				[payload.movieid, payload.actorid],
				(err, result) => {

					if (err) {
						reject(new Error(err));
					}
	
					if (!result || result.rowCount === 0) {
						conn.query(
							"INSERT INTO movie_cast(movie_id, actor_id) VALUES($1, $2)",
							[
								payload.movieid,
								payload.actorid,
							],
							(err) => {
								if (err) {
									reject(new Error(err));
								}
	
								resolve("Movie and Actor linked" );
							}
						);
					}
	
					resolve( "Movie and Actor already linked" );
				}
			);
		})
	}

	async deleteMovieCast(payload) {
		return new Promise((resolve, reject) => {
			conn.query(
				"SELECT * FROM movie_cast WHERE movie_id = $1 AND actor_id = $2",
				[payload.movieid, payload.actorid],
				(err, result) => {
					if (err) {
						reject(new Error(err));
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
									reject(new Error(err));
								}
	
								resolve("Movie and Actor delete" );
							}
						);
					}
	
					resolve( "Movie and Actor already nonexistent" );
				}
			);
		})
	}
}