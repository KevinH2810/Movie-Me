require("dotenv").config();

module.exports = {
    app: {
        port:  process.env.PORT || 9011,
    },
    token: {
        secret: process.env.SECRET_KEY,
    },
    db: {
		PORT: process.env.POSTGRESQL_PORT || 5432,
		HOST: process.env.POSTGRESQL_HOST,
		USER: process.env.POSTGRESQL_USER,
		PASSWORD: process.env.POSTGRESQL_PASS,
		DBNAME: process.env.POSTGRESQL_DB,
		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000,
		},
	},
}