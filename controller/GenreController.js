const {
  GenreService
  } = require("../services");
  const BaseController = require("./BaseController");
  const HandleError = require("./HandleError");
  const config = require("../config/config");
  
  module.exports = class GenreController extends BaseController {
    constructor() {
      super(new GenreService());
    }

    async getGenres(req, res) {
      const handleError = new HandleError();
  
      this.service.getGenres((err, result) => {
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

    async getGenrebyId(req,res){

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

    async getMostViewedGenre(req, res){
      const handleError = new HandleError();
  
      this.service.getMostViewedGenre((err, result) => {
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
