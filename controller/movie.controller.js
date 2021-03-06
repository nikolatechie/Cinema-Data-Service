const Movie = require("../model/movie");
const Joi = require("joi");
const roleAuth = require("../security/role.authorization");

// Validation schemas
const movieSchema = Joi.object({
    title: Joi.string().required(),
    year: Joi.number().integer().min(1800).max(2023).required(),
    genre: Joi.string().required(),
    rating: Joi.number().min(0.0).max(5.0).required()
});

const idSchema = Joi.object({
    id: Joi.number().integer().min(1)
});

const movieIdSchema = Joi.object({
    id: Joi.number().integer().min(1),
    title: Joi.string().required(),
    year: Joi.number().integer().min(1800).max(2023).required(),
    genre: Joi.string().required(),
    rating: Joi.number().min(0.0).max(5.0).required()
});

// Create and Save a new Movie
exports.create = (req, res) => {
    // check security
    let security = roleAuth.checkSecurity(req, ["admin", "moderator"]);

    if (!security) {
        res.status(401).send({message: "You are not authorized!"});
    }
    else {
        // Validate request
        if (!req.body) {
            res.status(400).send({
                message: "Content can not be empty!"
            });
        }

        // Data validation
        const {error} = movieSchema.validate(req.body);

        if (error) {
            res.status(500).send({
                message: error.message
            });

            return;
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
    }
};

// Return movie with the given ID
exports.findById = (req, res) => {
    Movie.findById(req.params.id, (err, data) => {
        if (err)
            res.status(500).second({
                message: err.message || "No movie found!"
            });
        else res.send(data);
    })
}

// Retrieve all Movies from the database (with condition).
exports.findAll = (req, res) => {
    // check security
    let security = roleAuth.checkSecurity(req, ["admin", "moderator"]);

    if (!security)
        res.status(401).send({ message: "You are not authorized!" });
    else {
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
    }
};

// Update a Movie identified by the id in the request
exports.update = (req, res) => {
    // check security
    let security = roleAuth.checkSecurity(req, ["admin", "moderator"]);

    if (!security)
        res.status(401).send({ message: "You are not authorized!" });
    else {
        // Validate Request
        if (!req.body) {
            res.status(400).send({
                message: "Content can not be empty!"
            });
        }

        // Data validation
        const obj = req.body;
        obj.id = req.params.id;
        const {error} = movieIdSchema.validate(obj);

        if (error) {
            res.status(500).send({
                message: error.message
            });

            return;
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
                    } else {
                        res.status(500).send({
                            message: "Error updating Movie with id " + req.params.id
                        });
                    }
                } else res.send(data);
            }
        );
    }
};

// Delete a Movie with the specified id in the request
exports.delete = (req, res) => {
    // check security
    let security = roleAuth.checkSecurity(req, ["admin", "moderator"]);

    if (!security)
        res.status(401).send({ message: "You are not authorized!" });
    else {
        // Data validation
        const {error} = idSchema.validate({id: req.params.id});

        if (error) {
            res.status(500).send({
                message: error.message
            });

            return;
        }

        Movie.remove(req.params.id, (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Movie with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Could not delete Movie with id " + req.params.id
                    });
                }
            } else res.send({message: `Movie was deleted successfully!`});
        });
    }
};