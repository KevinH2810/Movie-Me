const {
  ActorService
  } = require("../services");
  const BaseController = require("./BaseController");
  const HandleError = require("./HandleError");
  const config = require("../config/config");
const jwt = require("jsonwebtoken");
  
  module.exports = class ActorController extends BaseController {
    constructor() {
      super(new ActorService());
    }

    async getActors(req, res) {
      const handleError = new HandleError();
      const {page, limit} = req.query
  
      this.service.getActors({page, limit}, (err, result) => {
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

    async getActor(req,res){

		const handleError = new HandleError();
		const id = req.params.id;

		if (!id) {
			handleError.sendCatchError(res, `actor id must be supplied`);
			return;
		}

		await this.service.getActor(id, (err, result) => {
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

    async addActor(req, res){
      const handleError = new HandleError();

      const {
        actorName
      } = req.body;
  
      if (!actorName) {
        handleError.sendCatchError(res, `actorName is empty. please supply value`);
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
              handleError.sendCatchError(res, `Your Role is not permitted to add new actor`);
              return
            }
  
            this.service.insertActor(
              { actorName },
              async (err, result) => {
                if (err) {
                  handleError.sendCatchError(res, err);
                  return;
                }

                return this.sendSuccessResponse(res, {
                  status: 200,
                  message: `actor ${result.rows.actorname} succesfully added`,
                });
              }
            );
          }
        });
      } else {
        handleError.sendCatchError(res, `Auth Token is not supplied`);
        return;
      }
    }

    async updateActor(req, res){
      const handleError = new HandleError();

      const {
        id,
        actorName
      } = req.body;
  
      if (!id || !actorName) {
        handleError.sendCatchError(res, {
          status: 500,
          success: false,
          message: `id or actorName is empty. please supply the value`,
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
                message: `Your Role is not permitted to edit actor`,
              });
            }
  
            this.service.updateActorDetail(
              { actorName, id },
              async (err, result) => {
                if (err) {
                  handleError.sendCatchError(res, err);
                  return;
                }

                return this.sendSuccessResponse(res, {
                  status: 200,
                  message: "actor succesfully updated",
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

    async deleteActor(req, res){
      const handleError = new HandleError();

      const {
        id,
        actorName
      } = req.body;
  
      if (!id && !actorName) {
        handleError.sendCatchError(res, {
          status: 500,
          success: false,
          message: `id and actorName is empty. please supply one the value`,
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
            handleError.sendCatchError(res, `Token is not valid error = ${err}`);
            return;
          } else {
            if (decoded.role !== "admin") {
              return res.json(`Your Role is not permitted to delete the genre`);
            }

            //have to check on movie_actor before deleting actor
  
            this.service.deleteGenre(
              { id, actorName },
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
  }
