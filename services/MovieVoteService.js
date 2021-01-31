const { conn } = require("../db/connection");

module.exports = class MovieVoteService {
	async upsertMovieVote(payload, callback) {
		conn.query(
			`select id from movie_vote where movie_id = $1 and user_id = $2`,
			[payload.movie_id, payload.user_id],
			(err, res) => {
				if (err) {
					return callback(err, null);
				}
				if (res.rowCount === 0) {
					conn.query(
						`INSERT INTO movie_vote(movie_id, user_id, status) 
            VALUES($1, $2, 1) 
            RETURNING id`,
						[payload.movie_id, payload.user_id],
						(err, res) => {
							if (err) {
								return callback(err, null);
							}

							return callback(null, res.rows);
						}
					);
				} else {
					//1 for voted, 0 for unvoted
					conn.query(
						`UPDATE movie_vote
            SET status = $3
            WHERE movie_id = $1 and user_id = $2 RETURNING *`,
						[payload.movie_id, payload.user_id, payload.status],
						(err, res) => {
							if (err) {
								return callback(err, null);
							}

							return callback(null, res.rows);
						}
					);
				}
			}
		);
	}

	async getMovieVoteByUserId(payload, callback) {
		conn.query(
			`
			select id, movie_id, user_id, 
      case status 
	      when 1 then 'Voted'
	      when 0 then 'unvoted'
	    end as vote
			from movie_vote
			where user_id = $1
			LIMIT $2 OFFSET (($3 - 1) * $2)
			`,
			[payload.user_id, payload.limit, payload.page],
			async (err, result) => {
				if (err) {
					return callback(err, null);
				}

				return callback(null, result.rows);
			}
		);
	}

	async getMovieVoteByMovieId(payload, callback) {
		console.log("payload = ", payload)
		conn.query(
			`select id, movie_id, user_id, 
      case status 
	      when 1 then 'Voted'
	      when 0 then 'unvoted'
	    end as vote
			from movie_vote
			where movie_id = $1
			LIMIT $2 OFFSET (($3 - 1) * $2)
			`,
			[payload.movie_id, payload.limit, payload.page],
			async (err, result) => {
				if (err) {
					return callback(err, null);
				}
				console.log("result = ", result)

				return callback(null, result.rows);
			}
		);
	}
};
