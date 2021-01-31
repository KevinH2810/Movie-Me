const { conn } = require("../db/connection");

module.exports = class HistoryService {
  async addHistory(payload, callback){
    conn.query(
			`INSERT INTO history(movie_id, user_id) 
			VALUES($1, $2) 
			RETURNING id`,
			[payload.movie_id, payload.user_id],
			(err, res) => {
				if (err) {
					return callback(err, null);
				}

				return callback(null, res.rows);
			}
		);
	}
	
	async getHistoryById(payload, callback) {
		conn.query(
			`
			SELECT id, movie_id, user_id, date_watch 
			FROM history 
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
}