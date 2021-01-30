const { conn } = require("../db/connection");

module.exports = class MovieGenreService {
	async getMovieGenre(movieid){
		return new Promise((resolve, reject) => {
			conn.query(
				"SELECT * FROM movie_genre WHERE movie_id = $1",
				[movieid],
				(err, result) => {
					if (err) {
						reject(new Error(err));
					}

					if(result.rowCount === 0){
						reject(new Error("no genre for this film"))
					}

					resolve(result.rows)
				}
			)
		} )
	}

	async insertMovieGenre(payload) {
		return new Promise((resolve, reject) => {
			conn.query(
				"SELECT * FROM movie_genre WHERE movie_id = $1 AND genre_id = $2",
				[payload.movieid, payload.genreid],
				(err, result) => {
					if (err) {
						reject(new Error(err));
					}
          
					if (result.rowCount === 0) {
						conn.query(
							"INSERT INTO movie_genre(movie_id, genre_id) VALUES($1, $2)",
							[
								payload.movieid,
								payload.genreid,
							],
							(err) => {
								if (err) {
                  reject(new Error(err));
                }
	
								resolve("Movie and Genre linked" );
							}
						);
					}
	
					resolve( "Movie and Actor already linked" );
				}
			);
		})
	}

	async deleteMovieGenre(payload) {
		return new Promise((resolve, reject) => {
			conn.query(
				"SELECT * FROM movie_genre WHERE movie_id = $1 AND genre_id = $2",
				[payload.movieid, payload.genreid],
				(err, result) => {
					if (err) {
						reject(new Error(err));
					}
          
					if (result.rowCount > 0) {
            conn.query(
              "DELETE FROM movie_cast where movie_id= $1 , genre_id = $2 ",
              [
                payload.movieid,
                payload.genreid,
              ],
              (err) => {
                if (err) {
                  return callback(err, null);
                }
        
                return callback( null, "Movie Deleted" );
              }
            );
          }
        
          return callback( null, "Movie didnt have that genre as the tag" );
				}
			);
		})
	}
}