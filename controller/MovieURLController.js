const {
MovieURLService
} = require("../services");
const BaseController = require("./BaseController");
const HandleError = require("./HandleError");
const config = require("../config/config");
const jwt = require("jsonwebtoken");

module.exports = class MovieURLController extends BaseController {
	constructor() {
    super(new MovieURLService());
  }

  async getMovieURL(req, res) {
    const handleError = new HandleError();
		let {movie_id} = req.body;
		
		if(!movie_id){
			handleError.sendCatchError(
				res,
				`movie_id is empty. please supply param value`
			);
			return;
		}
  
    await this.service.getMovieURL(movie_id, (err, result) => {
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

  async addMovieURL(req, res) {
		const handleError = new HandleError();

		const { movie_id, url, servername } = req.body;

		if (!movie_id || !url || !servername) {
			handleError.sendCatchError(
				res,
				`movie_id or url or servername is empty. please supply param value`
			);
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
					handleError.sendCatchError(res, `Token is not valid error = ${err}`);
					return;
				} else {
					if (decoded.role !== "admin") {
						handleError.sendCatchError(
							res,
							`Your Role is not permitted to add new url`
						);
						return;
					}

					this.service.insertMovieURL({ movie_id, url, servername }, async (err, result) => {
						if (err) {
							handleError.sendCatchError(res, err);
							return;
						}

						return this.sendSuccessResponse(res, {
							status: 200,
							message: `url succesfully added`,
						});
					});
				}
			});
		} else {
			handleError.sendCatchError(res, `Auth Token is not supplied`);
			return;
		}
	}

  async updateMovieURL(req, res){
    const handleError = new HandleError();
    const {id, url, servername} = req.body;

    if (!id){
      handleError.sendCatchError(res, `id must be supplied`);
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
					handleError.sendCatchError(res, `Token is not valid error = ${err}`);
					return;
				} else {
					if (decoded.role !== "admin") {
						handleError.sendCatchError(
							res,
							`Your Role is not permitted to add new url`
						);
						return;
					}

					this.service.updateMovieURL({id, url, servername}, (err, result) => {
						if (err) {
							handleError.sendCatchError(res, err);
							return;
						}
				
						return this.sendSuccessResponse(res, {
							status: 200,
							message: `Movie updated succesfully`,
						});
					});
				}
			});
		} else {
			handleError.sendCatchError(res, `Auth Token is not supplied`);
			return;
		}
  }
	
	async deleteMovieURL(req, res){

    const handleError = new HandleError();
    const {id} = req.body;

    if (!id){
      handleError.sendCatchError(res, `id must be supplied`);
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
					handleError.sendCatchError(res, `Token is not valid error = ${err}`);
					return;
				} else {
					if (decoded.role !== "admin") {
						handleError.sendCatchError(
							res,
							`Your Role is not permitted to delete url`
						);
						return;
					}

					this.service.updateMovieURL(id, (err, result) => {
						if (err) {
							handleError.sendCatchError(res, err);
							return;
						}
				
						return this.sendSuccessResponse(res, {
							status: 200,
							message: "movie URL deleted succesfully",
						});
					});
				}
			});
		} else {
			handleError.sendCatchError(res, `Auth Token is not supplied`);
			return;
		}
	}
}