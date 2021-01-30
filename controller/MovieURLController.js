const {
MovieURLService
} = require("../services");
const BaseController = require("./BaseController");
const HandleError = require("./HandleError");
const config = require("../config/config");

module.exports = class MovieURLController extends BaseController {
	constructor() {
    super(new MovieURLService());
  }

  async getMovieURL(req, res) {
    const handleError = new HandleError();
    const {movie_id} = req.body;
  
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

  async updateMovieURL(req, res){
    const handleError = new HandleError();
    const {id, url, servername} = req.body;

    if (!id){
      handleError.sendCatchError(res, {
        status: 500,
				success: false,
				message: `movie id must be supplied`,
      });
      return;
    }

    await this.service.updateMovieURL({id, url, servername}, (err, result) => {
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
  
}