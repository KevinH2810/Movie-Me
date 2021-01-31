const { HistoryService } = require("../services");
const BaseController = require("./BaseController");
const HandleError = require("./HandleError");

module.exports = class HistoryController extends BaseController {
	constructor() {
		super(new HistoryService());
	}

	async getUserViewHistory(req, res) {
		const handleError = new HandleError();
    const id = req.params.id;
    const {limit, page} = req.query

    limit = limit ? limit : 10;
    page = page ? page : 1;

		if (!id) {
			handleError.sendCatchError(res, `user id must be supplied as param`);
			return;
		}

		await this.service.getHistoryById({user_id: id, limit, page}, (err, result) => {
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

	async insertHistory(req, res) {
		const handleError = new HandleError();

		const { movie_id } = req.body;

		if (!movie_id) {
			handleError.sendCatchError(res, {
				status: 500,
				success: false,
				message: `movie_id is empty. please supply value`,
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
					const user_id = decoded.userid;
					this.service.addHistory({ movie_id, user_id }, async (err) => {
						if (err) {
							handleError.sendCatchError(res, err);
							return;
						}

						return this.sendSuccessResponse(res, {
							status: 200,
							message: "History succesfully added",
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
