const { conn } = require("../db/connection");

module.exports = class MovieURLService {
  async getMovieURL(movieID, callback){
		conn.query("SELECT id, movie_id,url, servername FROM movie_url where movie_id = $1 returning id", [movieID],(err, results) => {
			if (err) {
				return callback(err, null);
			}

			return callback(null, results.rows);
		});
  }
  
	async insertMovieURL(payload, callback) {
		conn.query(
			"INSERT INTO movie_url(movie_id, url, servername) VALUES($1, $2, $3) RETURNING id",
			[payload.movie_id, payload.url, payload.servername],
			(err, res) => {
				if (err) {
					return callback(err, null);
				}

				return callback(null, res.rows[0].id);
			}
		);
  }
  
  async updateMovieURL(payload, callback){
    conn.query(
      "UPDATE movie_url Set url = $1, servername = $2 where id = $3 RETURNING id",
      [
        payload.url,
        payload.servername,
        payload.id,
      ],
      (err, res) => {
        if (err) {
          return callback(err, null);
        }
        return callback(null, res.rows);
      }
    );
  }

  async DeleteMovieURL(movieURLId, callback){
		conn.query(
			"DELETE FROM movie_url where id = $1",
			[
				movieURLId
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
