const {
	MovieService,
} = require("../services");
const BaseController = require("./BaseController");
const HandleError = require("./HandleError");

module.exports = class SearchController extends BaseController {
	constructor() {
    super(new MovieService());
  }

  async searchKeyword(req, res){
    const handleError = new HandleError();
    let { search, limit, page } = req.body;

    limit = limit ? limit : 10;
    page = page ? page : 1;

		await this.service.searchMovies({search, limit, page}, (err, result) => {
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
}