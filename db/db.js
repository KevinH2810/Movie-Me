var md5 = require("md5");
const chalk = require("chalk");
const { conn } = require("./connection");
const Promise = require("promise");

module.exports = class DB {
	async init() {
		const createTableUserLogin = this.createTableUserLogin()
const createTableActor = this.createTableActor()
const createTableGenre = this.createTableGenre()
const createTableMovie = this.createTableMovie()

Promise.all([createTableUserLogin,createTableActor, createTableGenre, createTableMovie])
    .then((res) => {
    this.createTableMovieCast()
.then(this.createTableMovieGenre())
.then(this.createTableMovieURL())
    .then(this.createTableHistory())
    .then(this.createTableMovieVote())
.catch((error) => {
console.log(`error = ${error}`);
});
    })
	}

	createTableUserLogin() {
		return new Promise((resolve) => {
			conn.query(
				`CREATE TABLE public.userlogin (
                id serial NOT NULL,
                username varchar NULL,
                "password" varchar NULL,
                email varchar NULL,
                userrole varchar NULL,
                CONSTRAINT userlogin_pk PRIMARY KEY (id)
            );
        `,
				(err) => {
					if (err) {
						console.log(
							chalk.green("[Init-DB] - Table UserLogin already exist")
						);
						return;
					}

					// Table just created, creating some rows

					console.log(chalk.green("[Init-DB] - Table UserLogin created"));
					var insert =
						"INSERT INTO userlogin (username, password, email, role) VALUES (?,?, ?, ?)";
					conn.query(insert, ["admin", md5("admin123456"), "admin@admin.com","admin"]);
					conn.query(insert, ["user", md5("user123456"), "user@user.com","basic"]);

					resolve();
				}
			);
		});
	}

	createTableActor() {
		return new Promise((resolve) => {
			conn.query(
				`
            CREATE TABLE public.actor (
                id serial NOT NULL,
                actorname varchar NULL,
                edited_at varchar NULL DEFAULT now(),
                edited_by varchar NULL,
                CONSTRAINT artist_pk PRIMARY KEY (id)
            );            
            `,
				(err) => {
					if (err) {
						console.log(chalk.green("[Init-DB] - Table Actor already exist"));
						return;
					}

					console.log(chalk.green("[Init-DB] - Table Actor created"));

					resolve();
				}
			);
		});
	}

	createTableGenre() {
		return new Promise((resolve) => {
			conn.query(
				`
            CREATE TABLE public.genre (
                id serial NOT NULL,
                genrename varchar NULL,
                edited_at varchar NULL DEFAULT now(),
                edited_by varchar NULL,
                viewed int4 NULL DEFAULT 0,
                CONSTRAINT genre_pk PRIMARY KEY (id)
            );`,
				(err) => {
					if (err) {
						console.log(chalk.green("[Init-DB] -  Table Genre already exist"));
						return;
					}

					console.log(chalk.green("[Init-DB] - Table Genre created"));

					resolve();
				}
			);
		});
	}

	createTableMovie() {
		return new Promise((resolve) => {
			conn.query(
				`
                CREATE TABLE public.movie (
                    id serial NOT NULL,
                    title varchar NULL,
                    description varchar NULL,
                    durations int4 NULL,
                    yearrelease int4 NULL,
                    movielang varchar NULL,
                    viewed int4 NULL DEFAULT 0,
                    voted int4 NULL DEFAULT 0,
                    edited_at varchar NULL DEFAULT now(),
                    edited_by varchar NULL,
                    CONSTRAINT movie_pk PRIMARY KEY (id)
                );
                `,
				(err) => {
					if (err) {
						console.log(chalk.green("[Init-DB] - Table Movie already exist"));
						return;
					}

					console.log(chalk.green("[Init-DB] - Table Movie created"));

					resolve();
				}
			);
		});
	}

	createTableHistory() {
		return new Promise((resolve) => {
			conn.query(
				`
                CREATE TABLE public.history (
                    id serial NOT NULL,
                    movie_id int4 NULL,
                    user_id int4 NULL,
                    date_watch varchar NULL DEFAULT now(),
                    CONSTRAINT history_fk FOREIGN KEY (movie_id) REFERENCES movie(id) ON UPDATE CASCADE ON DELETE CASCADE,
                    CONSTRAINT history_fk_1 FOREIGN KEY (user_id) REFERENCES userlogin(id) ON UPDATE CASCADE ON DELETE CASCADE
                );
                `,
				(err) => {
					if (err) {
						console.log(chalk.green("[Init-DB] - Table History already exist"));
						return;
					}

					console.log(chalk.green("[Init-DB] - Table History created"));

					resolve();
				}
			);
		});
	}

	createTableMovieCast() {
		return new Promise((resolve) => {
			conn.query(
				`
                CREATE TABLE public.movie_cast (
                    movie_id int4 NULL,
                    actor_id int4 NULL,
                    CONSTRAINT newtable_fk FOREIGN KEY (movie_id) REFERENCES movie(id),
                    CONSTRAINT newtable_fk_1 FOREIGN KEY (actor_id) REFERENCES actor(id)
                );
                
                `,
				(err) => {
					if (err) {
						console.log(
							chalk.green("[Init-DB] - Table Movie_cast already exist")
						);
						return;
					}

					console.log(chalk.green("[Init-DB] - Table Movie_cast created"));

					resolve();
				}
			);
		});
	}

	createTableMovieGenre() {
		return new Promise((resolve) => {
			conn.query(
				`
                CREATE TABLE public.movie_genre (
                    movie_id int4 NULL,
                    genre_id int4 NULL,
                    CONSTRAINT movie_genre_fk FOREIGN KEY (movie_id) REFERENCES movie(id) ON UPDATE CASCADE ON DELETE CASCADE,
                    CONSTRAINT movie_genre_fk_1 FOREIGN KEY (genre_id) REFERENCES genre(id)
                );                
                `,
				(err) => {
					if (err) {
						console.log(
							chalk.green("[Init-DB] - Table movie_genre already exist")
						);
						return;
					}

					console.log(chalk.green("[Init-DB] - Table movie_genre created"));

					resolve();
				}
			);
		});
	}

	createTableMovieURL() {
		return new Promise((resolve) => {
			conn.query(
				`
                CREATE TABLE public.movie_url (
                    id serial NOT NULL,
                    movie_id int4 NOT NULL,
                    url varchar NULL,
                    servername varchar NULL,
                    edited_at varchar NULL DEFAULT now(),
                    edited_by varchar NULL,
                    CONSTRAINT movie_url_pk PRIMARY KEY (id),
                    CONSTRAINT movie_url_fk FOREIGN KEY (movie_id) REFERENCES movie(id)
                );
                `,
				(err) => {
					if (err) {
						console.log(
							chalk.green("[Init-DB] - Table movie_url already exist")
						);
						return;
					}

					console.log(chalk.green("[Init-DB] - Table movie_url created"));

					resolve();
				}
			);
		});
	}

	createTableMovieVote() {
		return new Promise((resolve) => {
			conn.query(
				`
                CREATE TABLE public.movie_vote (
                    id serial NOT NULL,
                    movie_id int4 NULL,
                    user_id int4 NULL,
                    status int4 NULL,
                    edited_at varchar NULL DEFAULT now(),
                    CONSTRAINT movie_vote_pk PRIMARY KEY (id),
                    CONSTRAINT movie_vote_fk FOREIGN KEY (movie_id) REFERENCES movie(id) ON UPDATE CASCADE ON DELETE CASCADE,
                    CONSTRAINT movie_vote_fk_1 FOREIGN KEY (user_id) REFERENCES userlogin(id) ON UPDATE CASCADE ON DELETE CASCADE
                );
                `,
				(err) => {
					if (err) {
						console.log(
							chalk.green("[Init-DB] - Table movie_vote already exist")
						);
						return;
					}

					console.log(chalk.green("[Init-DB] - Table movie_vote created"));

					resolve();
				}
			);
		});
	}
};
