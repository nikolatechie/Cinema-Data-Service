const sql = require("./db.js");

const Movie = function(movie) {
    this.title = movie.title;
    this.year = movie.year;
    this.genre = movie.genre;
    this.rating = movie.rating;
};

Movie.create = (newMovie, result) => {
    sql.query("INSERT INTO movie SET ?", newMovie, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created movie: ", { id: res.insertId, ...newMovie });
        result(null, { id: res.insertId, ...newMovie });
    });
};

Movie.findById = (id, result) => {
    sql.query(`SELECT * FROM movie WHERE id = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found movie: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Movie with the id
        result({ kind: "not_found" }, null);
    });
};

Movie.getAll = (title, result) => {
    let query = "SELECT * FROM movie";

    if (title)
        query += ` WHERE title LIKE '%${title}%'`;

    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("movie: ", res);
        result(null, res);
    });
};

Movie.updateById = (id, movie, result) => {
    sql.query(
        "UPDATE movie SET title = ?, year = ?, genre = ?, rating = ? WHERE id = ?",
        [movie.title, movie.year, movie.genre, movie.rating, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Movie with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated movie: ", { id: id, ...movie });
            result(null, { id: id, ...movie });
        }
    );
};

Movie.remove = (id, result) => {
    sql.query("DELETE FROM movie WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found Movie with the id
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted movie with id: ", id);
        result(null, res);
    });
};

module.exports = Movie;