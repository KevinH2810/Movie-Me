const { MovieService, ActorService } = require("../services");
const BaseController = require("./BaseController");
const HandleError = require("./HandleError");
const config = require('../config/config');
const jwt = require('jsonwebtoken');

module.exports = class MovieController extends BaseController {
	constructor() {
		super(new MovieService());
        // this.userService = new UserService();
        this.actorService = new ActorService();
	}

	async getMovie(req, res) {
		const handleError = new HandleError();

		await this.service.getMovie((err,result) => {
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
        const { id, title, actors, genre, description, yearrelease, movielang } = req.body;
        let actorsArr = actors.split(",")
        let ActorIdArr = [];
        for(let actorName of actorsArr) {
            let ActorId = await this.actorService.getActor({actorName})
            ActorIdArr.push(ActorId)
        }
        // let genreArr = genre.split(",")
        
        //validate user role
        let token = req.headers['x-access-token'] || req.headers['authorization']; // Express headers are auto converted to lowercase
        if (token.startsWith('Bearer ')) {
            // Remove Bearer from string
            token = token.slice(7, token.length);
        }

        if (token) {
            jwt.verify(token, config.token.secret, (err, decoded) => {
                if (err) {
                    handleError.sendCatchError(res, {
                        status: 500,
                        success: false,
                        message: `Token is not valid error = ${err}`
                    });
                    return;
                } else {
                    if (decoded.role !== 'admin') {
                                return res.json({
                                    status: 200,
                                    success: false,
                                    message: `Your Role is not permitted to edit or add movie`
                                });
                            }

                    //add function to insert actor to MovieActorTxTable and insert Actor if not exist
                        
                    //add function to insert Genre to MovieGenreTxTable and insert Genre if not exist
                    //add artistId and Genreid, and upsert correspondently
                    this.service.upsertMovie({ id, title, description, yearrelease, movielang }, (err, result)=>{
                        if (err) {
                            handleError.sendCatchError(res, err);
                            return;
                        } 

                        return this.sendSuccessResponse(res, {
                            status: 200,
                            message: result,
                        });
                    })
                }
            });
        } else {
            handleError.sendCatchError(res, {
                status: 500,
                success: false,
                message: `Auth Token is not supplied`
            });
            return;
        }
	}
};
