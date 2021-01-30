const { conn } = require("../db/connection");

module.exports = class MovieService {
	async upsertMovie(payload, callback) {
		conn.query(
			"SELECT * FROM movie WHERE title like $1 ",
			["%" + payload.title + "%"],
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

							return callback(null, res);
						}
					);
				} else {
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

	async getMovies(callback) {
		conn.query(
			`SELECT movie.id, title, string_agg(distinct actor.actorname , ',') as actorname, 
			string_agg(distinct g2.genrename , ',') as genrename, description, durations, 
			yearrelease, movielang, movie.viewed, voted
			FROM movie movie 
			inner join movie_cast movcast on movie.id = movcast.movie_id 
			inner join actor actor on movcast.actor_id=actor.id 
			inner join movie_genre mg on movie.id = mg.movie_id 
			inner join genre g2 on mg.genre_id = g2.id
			group by movie.id
			`,
			(err, results) => {
				if (err) {
					return callback(err, null);
				}

				return callback(null, results);
			}
		);
	}

	async getMostViewedMovie(callback) {
		conn.query(
			`SELECT movie.id, title, string_agg(distinct actor.actorname , ',') as actorname, string_agg(distinct g2.genrename , ',') as genrename, description, durations, yearrelease, movielang, movie.viewed, voted
			FROM movie movie 
			INNER JOIN (select MAX(viewed) as viewed from movie) b on movie.viewed = b.viewed 
			inner join movie_cast movcast on movie.id = movcast.movie_id 
			inner join actor actor on movcast.actor_id=actor.id 
			inner join movie_genre mg on movie.id = mg.movie_id 
			inner join genre g2 on mg.genre_id = g2.id
			group by movie.id
			`,
			(err, results) => {
				if (err) {
					return callback(err, null);
				}

				return callback(null, results);
			}
		);
	}

	async getMovie(id, callback) {
		conn.query(
			`SELECT movie.id, title, string_agg(distinct actor.actorname , ',') as actorname, 
			string_agg(distinct g2.genrename , ',') as genrename, description, durations, 
			yearrelease, movielang, movie.viewed, voted
			FROM movie movie 
			inner join movie_cast movcast on movie.id = movcast.movie_id 
			inner join actor actor on movcast.actor_id=actor.id 
			inner join movie_genre mg on movie.id = mg.movie_id 
			inner join genre g2 on mg.genre_id = g2.id
			group by movie.id
			where movie.id = $1`,
			[id],
			(err, results) => {
				if (err) {
					return callback(err, null);
				}

				return callback(null, results.rows);
			}
		);
	}

	async updateMovieDetail(payload, callback) {
		conn.query(
			"UPDATE movie Set title = $1, description = $2, durations= $3, yearrelease = $4, movielang = $5 where id = $6 RETURNING id",
			[
				payload.title,
				payload.description,
				payload.durations,
				payload.yearrelease,
				payload.movielang,
				payload.id,
			],
			(err, res) => {
				if (err) {
					return callback(err, null);
				}
				return callback(null, res.rows[0].id);
			}
		);
	}

	async addMovieViewed(id) {
		return new Promise((resolve, reject) => {
			conn.query(
				"UPDATE movie Set viewed = viewed + 1 where id = $1 RETURNING *",
				[id],
				(err, res) => {
					if (err) {
						reject(new Error(err));
					}

					resolve(res.rows);
				}
			);
		});
	}

	async DeleteMovie(movieId, callback){
		conn.query(
			"DELETE FROM movie where id = $1",
			[
				movieId
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
