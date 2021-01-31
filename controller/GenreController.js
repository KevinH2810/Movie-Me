const {
  GenreService,
  MovieGenreService
  } = require("../services");
  const BaseController = require("./BaseController");
  const HandleError = require("./HandleError");
  const config = require("../config/config");
const jwt = require("jsonwebtoken");
  
  module.exports = class GenreController extends BaseController {
    constructor() {
      super(new GenreService());
      this.movieGenreService = new MovieGenreService();
    }

    async getGenres(req, res) {
      const handleError = new HandleError();
      const {page, limit} = req.body
  
      this.service.getGenres({page, limit},(err, result) => {
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

    async getGenrebyId(req,res){

		const handleError = new HandleError();
		const id = req.params.id;

		if (!id) {
			handleError.sendCatchError(res, `genre id must be supplied`);
			return;
		}

		await this.service.getGenre(id, (err, result) => {
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

    async insertGenre(req, res){
      const handleError = new HandleError();

      const {
        genreName
      } = req.body;
  
      if (!genreName) {
        handleError.sendCatchError(res, `genreName is empty. please supply value`);
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
              return res.json({
                status: 200,
                success: false,
                message: `Your Role is not permitted to add genre`,
              });
            }
  
            this.service.insertGenre(
              { genreName },
              async (err) => {
                if (err) {
                  handleError.sendCatchError(res, err);
                  return;
                }

                return this.sendSuccessResponse(res, {
                  status: 200,
                  message: "genre succesfully added",
                });
              }
            );
          }
        });
      } else {
        handleError.sendCatchError(res, `Auth Bearer Token is not supplied`);
        return;
      }
    }

    async updateGenre(req, res){
      const handleError = new HandleError();

      const {
        id,
        genreName
      } = req.body;
  
      if (!id || !genreName) {
        handleError.sendCatchError(res, `id or genreName is empty. please supply the value`);
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
              return res.json({
                status: 200,
                success: false,
                message: `Your Role is not permitted to edit genre`,
              });
            }
  
            this.service.updateGenreDetail(
              { genreName, id },
              async (err, result) => {
                if (err) {
                  handleError.sendCatchError(res, err);
                  return;
                }

                return this.sendSuccessResponse(res, {
                  status: 200,
                  message: "genre succesfully updated",
                });
              }
            );
          }
        });
      } else {
        handleError.sendCatchError(res, `Auth Bearer Token is not supplied`);
        return;
      }
    
    }

    async deleteGenre(req, res){
      const handleError = new HandleError();

      const {
        id,
        genreName
      } = req.body;
  
      if (!id && !genreName) {
        handleError.sendCatchError(res, `id and genreName is empty. please supply one the value`);
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
              return res.json({
                status: 200,
                success: false,
                message: `Your Role is not permitted to delete the genre`,
              });
            }

            //have to check and delete on movie_genre before deleting
            
            this.movieGenreService.deleteMovieGenreByGenreId({id}, (err) => {
              if (err) {
                handleError.sendCatchError(res, err);
                return;
              }

              this.service.deleteGenre(
                { id, genreName },
                async (err, result) => {
                  if (err) {
                    handleError.sendCatchError(res, err);
                    return;
                  }
  
                  return this.sendSuccessResponse(res, {
                    status: 200,
                    message: "genre succesfully deleted",
                  });
                }
              );
            })
          }
        });
      } else {
        handleError.sendCatchError(res, `Auth Bearer Token is not supplied`);
        return;
      }
    }
  }
