const {
	MovieService,
	ActorService,
	MovieCastService,
	GenreService,
	MovieGenreService,
} = require("../services");
const BaseController = require("./BaseController");
const HandleError = require("./HandleError");
const config = require("../config/config");
const jwt = require("jsonwebtoken");

module.exports = class MovieController extends BaseController {
	constructor() {
		super(new MovieService());
		// this.userService = new UserService();
		this.actorService = new ActorService();
		this.movieCastService = new MovieCastService();
		this.genreService = new GenreService();
		this.movieGenreService = new MovieGenreService();
	}

	async getMovies(req, res) {
		const handleError = new HandleError();
		const {page, limit} = req.query

		this.service.getMovies({page, limit}, (err, result) => {
			if (err) {
				handleError.sendCatchError(res, err);
				return;
			}

			return this.sendSuccessResponse(res, {
				status: 200,
				message: result.rows,
				paginate: {
					limit: limit || result.rowCount,
					page: page || 1,
				}
			});
		});
	}

	async getMovie(req, res) {
		const handleError = new HandleError();
		const id = req.params.id;

		if (!id) {
			handleError.sendCatchError(res, `movie id must be supplied`);
			return;
		}

		await this.service.addMovieViewed(id);

		//add service to add counter to genre
		const genreList = await this.movieGenreService.getMovieGenre(id);
		for (let genreid of genreList) {
			this.genreService.addGenreViewedCount(genreid.genre_id);
		}

		await this.service.getMovie(id, (err, result) => {
			if (err) {
				handleError.sendCatchError(res, err);
				return;
			}

			return this.sendSuccessResponse(res, {
				status: 200,
				message: result,
			});
		});
	}

	async addMovie(req, res) {
		const handleError = new HandleError();

		//artis & genre is coma string
		const {
			title,
			actors,
			genre,
			description,
			yearrelease,
			movielang,
			durations,
		} = req.body;

		if (!title || !actors || !genre) {
			handleError.sendCatchError(res, {
				status: 500,
				success: false,
				message: `Title / actors / genre fields are mandatory`,
			});
			return;
		}

		//validate user role
		let token = req.headers["x-access-token"] || req.headers["authorization"]; // Express headers are auto converted to lowercase
		if (token && token.startsWith("Bearer ")) {
			// Remove Bearer from string
			token = token.slice(7, token.length);
		}

		if (token) {
			jwt.verify(token, config.token.secret, async (err, decoded) => {
				if (err) {
					handleError.sendCatchError(res, {
						status: 500,
						success: false,
						message: `Token is not valid error = ${err}`,
					});
					return;
				} else {
					if (decoded.role !== "admin") {
						return res.json({
							status: 200,
							success: false,
							message: `Your Role is not permitted to edit or add movie`,
						});
					}

					//get each of ActorId
					let actorsArr = actors.split(",");
					let ActorIdArr = [];
					for (let actorName of actorsArr) {
						let ActorId = await this.actorService.getActorbyActorName({ actorName });
						ActorIdArr.push(ActorId);
					}

					//get each of GenreId
					let genreArr = genre.split(",");
					let GenreIdArr = [];
					for (let genreName of genreArr) {
						let genreId = await this.genreService.getGenresbyName({ genreName });
						GenreIdArr.push(genreId);
					}

					this.service.insertMovie(
						{ title, description, yearrelease, movielang, durations },
						async (err, result) => {
							if (err) {
								handleError.sendCatchError(res, err);
								return;
							}

							//add function to insert actor to MovieActorTxTable and insert Actor if not exist
							for (let actorid of ActorIdArr) {
								await this.movieCastService.insertMovieCast({
									movieid: result,
									actorid,
								});
							}

							//add artistId and Genreid, and upsert correspondently
							for (let genreid of GenreIdArr) {
								await this.movieGenreService.insertMovieGenre({
									movieid: result,
									genreid,
								});
							}

							return this.sendSuccessResponse(res, {
								status: 200,
								message: "Movie succesfully upsert",
							});
						}
					);
				}
			});
		} else {
			handleError.sendCatchError(res, {
				status: 500,
				success: false,
				message: `Auth Token is not supplied`,
			});
			return;
		}
	}

	async updateMovieDetail(req, res) {
		const handleError = new HandleError();
		const {
			id,
			title,
			description,
			durations,
			yearrelease,
			movielang,
		} = req.body;

		//validate user role
		let token = req.headers["x-access-token"] || req.headers["authorization"]; // Express headers are auto converted to lowercase
		if (token && token.startsWith("Bearer ")) {
			// Remove Bearer from string
			token = token.slice(7, token.length);
		}

		if (token) {
			jwt.verify(token, config.token.secret, async (err, decoded) => {
				if (err) {
					handleError.sendCatchError(res, {
						status: 500,
						success: false,
						message: `Token is not valid error = ${err}`,
					});
					return;
				} else {
					if (decoded.role !== "admin") {
						return res.json({
							status: 200,
							success: false,
							message: `Your Role is not permitted to edit or add movie`,
						});
					}

					if (!id) {
						handleError.sendCatchError(res, {
							status: 500,
							success: false,
							message: `movie id must be supplied`,
						});
						return;
					}

					this.service.updateMovieDetail(
						{ id, title, description, durations, yearrelease, movielang },
						(err, result) => {
							if (err) {
								handleError.sendCatchError(res, err);
								return;
							}

							return this.sendSuccessResponse(res, {
								status: 200,
								message: result,
							});
						}
					);
				}
			});
		} else {
			handleError.sendCatchError(res, {
				status: 500,
				success: false,
				message: `Auth Token is not supplied`,
			});
			return;
		}
	}

	async getMostViewed(req, res) {
		const handleError = new HandleError();

		this.service.getMostViewed((err, result) => {
			if (err) {
				handleError.sendCatchError(res, err);
				return;
			}

			return this.sendSuccessResponse(res, {
				status: 200,
				message: result.rows,
			});
		});
	}

	async deleteMovie(req, res) {
		const handleError = new HandleError();
		const { id } = req.body;

		if (!id) {
			handleError.sendCatchError(res, {
				status: 500,
				success: false,
				message: `movie id must be supplied`,
			});
			return;
		}

		//validate user role
		let token = req.headers["x-access-token"] || req.headers["authorization"]; // Express headers are auto converted to lowercase
		if (token && token.startsWith("Bearer ")) {
			// Remove Bearer from string
			token = token.slice(7, token.length);
		}

		if (token) {
			jwt.verify(token, config.token.secret, async (err, decoded) => {
				if (err) {
					handleError.sendCatchError(res, {
						status: 500,
						success: false,
						message: `Token is not valid error = ${err}`,
					});
					return;
				} else {
					if (decoded.role !== "admin") {
						return res.json({
							status: 200,
							success: false,
							message: `Your Role is not permitted to delete a movie`,
						});
					}

					//check for movie in Movie_url, movie_cast and delete it

					this.service.DeleteMovie(id, (err, result) => {
						if (err) {
							handleError.sendCatchError(res, err);
							return;
						}

						return this.sendSuccessResponse(res, {
							status: 200,
							message: result,
						});
					});
				}
			});
		} else {
			handleError.sendCatchError(res, {
				status: 500,
				success: false,
				message: `Auth Token is not supplied`,
			});
			return;
		}
	}
};
