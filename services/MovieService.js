const { conn } = require("../db/connection");

module.exports = class MovieService {
	async insertMovie(payload, callback) {
		conn.query(
			`INSERT INTO movie(title, description, durations, yearrelease, movielang) 
			SELECT '$1', '$2', $3, $4, '$5'
			WHERE NOT EXISTS ( SELECT 1 FROM movie WHERE title = $1 )
			RETURNING id`,
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

				if(res.rowCount === 0){
					return callback(null, `movie with title ${payload.title} already exists`)
				}

				return callback(null, res);
			}
		);
	}

	async getMovies(payload, callback) {
		conn.query(
			`SELECT movie.id, title, string_agg(distinct actor.actorname , ',') as actorname, 
			string_agg(distinct g2.genrename , ',') as genrename, description, durations, 
			yearrelease, movielang, movie.viewed, voted
			FROM movie movie 
			inner join movie_cast movcast on movie.id = movcast.movie_id 
			inner join actor actor on movcast.actor_id=actor.id 
			inner join movie_genre mg on movie.id = mg.movie_id 
			inner join genre g2 on mg.genre_id = g2.id
			GROUP BY movie.id
			ORDER BY id
			LIMIT $1 OFFSET (($2 - 1) * $1)
			`,[payload.limit, payload.page],
			(err, results) => {
				if (err) {
					return callback(err, null);
				}

				return callback(null, results);
			}
		);
	}

	async searchMovies(payload, callback) {
		conn.query(
			`SELECT movie.id, title, string_agg(distinct actor.actorname , ',') as actorname, 
			string_agg(distinct g2.genrename , ',') as genrename, description, durations, 
			yearrelease, movielang, movie.viewed, voted
			FROM movie movie 
			inner join movie_cast movcast on movie.id = movcast.movie_id 
			inner join actor actor on movcast.actor_id=actor.id 
			inner join movie_genre mg on movie.id = mg.movie_id 
			inner join genre g2 on mg.genre_id = g2.id
			where title ilike $1  or actorname ilike $1  or genrename ilike $1  or description ilike $1
			GROUP BY movie.id
			ORDER BY id
			LIMIT $2 OFFSET (($3 - 1) * $2)
			`,['%' + payload.search + '%', payload.limit, payload.page],(err, results) => {
				if (err) {
					return callback(err, null);
				}

				return callback(null, results);
			});
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

	async getMostVotedMovie(callback) {
		conn.query(
			`SELECT movie.id, title, string_agg(distinct actor.actorname , ',') as actorname, string_agg(distinct g2.genrename , ',') as genrename, description, durations, yearrelease, movielang, movie.viewed, movie.voted
			FROM movie movie 
			INNER JOIN (select MAX(voted) as voted from movie) b on movie.voted = b.voted 
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

	async updateMovieVote(payload){
		console.log("payload = ", payload)
		return new Promise((resolve, reject) => {
			conn.query(
				`UPDATE movie 
				Set voted = voted + $2
				where id = $1
				RETURNING voted`,
				[
					payload.movie_id,
					payload.statusVal
				],
				(err, res) => {
					if (err) {
						reject(new Error(err));
					}
					resolve(res.rows);
				}
			);
		})
	}

	async DeleteMovie(movieId, callback) {
		conn.query("DELETE FROM movie where id = $1", [movieId], (err, res) => {
			if (err) {
				return callback(err, null);
			}
			return callback(null, res);
		});
	}
};
