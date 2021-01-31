const { MovieVoteService, MovieService } = require("../services");
const BaseController = require("./BaseController");
const HandleError = require("./HandleError");
const config = require("../config/config");
const jwt = require("jsonwebtoken");

module.exports = class MovieURLController extends BaseController {
	constructor() {
		super(new MovieVoteService());
		this.movieService = new MovieService();
	}

	async getMovieVoteByUserId(req, res) {
		const handleError = new HandleError();
		let { limit, page } = req.body;

		limit = limit ? limit : 10;
		page = page ? page : 1;

		//add to movie history if user logged in
		//validate user role
		let token = req.headers["x-access-token"] || req.headers["authorization"]; // Express headers are auto converted to lowercase
		if (token && token.startsWith("Bearer ")) {
			// Remove Bearer from string
			token = token.slice(7, token.length);
		}

		if (token) {
			jwt.verify(token, config.token.secret, async (err, decoded) => {
				if (err) {
					handleError.sendCatchError(res, `Token is not valid error = ${err}`);
					return;
				} else {
					//check for movie in Movie_url, movie_cast and delete it
					const user_id = decoded.userid;
					this.service.getMovieVoteByUserId({ user_id, limit, page }, (err, result) => {
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
		}
	}

	async getMovieVoteByMovieId(req, res) {
		const handleError = new HandleError();
		let { movie_id, limit, page } = req.body;

		limit = limit ? limit : 10;
		page = page ? page : 1;

		//add to movie history if user logged in
		//validate user role
		let token = req.headers["x-access-token"] || req.headers["authorization"]; // Express headers are auto converted to lowercase
		if (token && token.startsWith("Bearer ")) {
			// Remove Bearer from string
			token = token.slice(7, token.length);
		}

		if (token) {
			jwt.verify(token, config.token.secret, async (err, decoded) => {
				if (err) {
					handleError.sendCatchError(res, `Token is not valid error = ${err}`);
					return;
				} else {
					//check for movie in Movie_url, movie_cast and delete it
					this.service.getMovieVoteByMovieId({movie_id, limit, page }, (err, result) => {
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
		}
	}

	//1 for voted, 0 for unvoted
	async upsertMovieVote(req, res) {
		const handleError = new HandleError();
		const { movie_id, status } = req.body;

		if (!movie_id || !status ) {
			handleError.sendCatchError(res, `movie_id and status  must be supplied`);
			return;
		}

		if (status !== '1' && status !== '0'){
			handleError.sendCatchError(res, `status value can only be 1 for voted and 0 for unvoted`);
			return;
		}

		let statusVal = 0;
		if (status === '1') {
			statusVal = statusVal + 1;
		} else if (status === '0') {
			statusVal = statusVal - 1;
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
					handleError.sendCatchError(res, `Token is not valid error = ${err}`);
					return;
				} else {
					this.movieService.updateMovieVote({ movie_id, statusVal });

					const user_id = decoded.userid;

					this.service.upsertMovieVote({ movie_id, user_id, status }, (err, result) => {
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
			handleError.sendCatchError(res, `Auth Token is not supplied`);
			return;
		}
	}
};
