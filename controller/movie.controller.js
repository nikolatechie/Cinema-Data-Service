const Movie = require("../model/movie");

// Create and Save a new Movie
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Movie
    const movie = new Movie({
        title: req.body.title,
        year: req.body.year,
        genre: req.body.genre,
        rating: req.body.rating
    });

    // Save Movie in the database
    Movie.create(movie, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Movie."
            });
        else
            res.send(data);
    });
};

// Retrieve all Movies from the database (with condition).
exports.findAll = (req, res) => {
    const title = req.query.title;

    Movie.getAll(title, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving movies."
            });
        else
            res.send(data);
    });
};

// Update a Movie identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Movie.updateById(
        req.params.id,
        new Movie(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Movie with id ${req.params.id}.`
                    });
                }
                else {
                    res.status(500).send({
                        message: "Error updating Movie with id " + req.params.id
                    });
                }
            }
            else res.send(data);
        }
    );
};

// Delete a Movie with the specified id in the request
exports.delete = (req, res) => {
    Movie.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Movie with id ${req.params.id}.`
                });
            }
            else {
                res.status(500).send({
                    message: "Could not delete Movie with id " + req.params.id
                });
            }
        }
        else res.send({ message: `Movie was deleted successfully!` });
    });
};