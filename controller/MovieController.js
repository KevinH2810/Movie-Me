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

	async getMovie(req, res) {
		const handleError = new HandleError();

		await this.service.getMovie((err, result) => {
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

		//artis & genre is array of ids
		const {
			id,
			title,
			actors,
			genre,
			description,
			yearrelease,
			movielang,
			durations,
		} = req.body;

		//validate user role
		let token = req.headers["x-access-token"] || req.headers["authorization"]; // Express headers are auto converted to lowercase
		if (token.startsWith("Bearer ")) {
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
						let ActorId = await this.actorService.getActor({ actorName});
						ActorIdArr.push(ActorId);
					}

					//get each of GenreId
					let genreArr = genre.split(",");
					let GenreIdArr = [];
					for (let genreName of genreArr) {
						let genreId = await this.genreService.getGenre({ genreName});
						GenreIdArr.push(genreId);
					}

					this.service.upsertMovie(
						{ id, title, description, yearrelease, movielang, durations },
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
};
