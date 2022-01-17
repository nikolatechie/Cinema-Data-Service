const Schedule = require("../model/schedule");
const Joi = require("joi");

// Validation schemas
const scheduleSchema = Joi.object({
    movieId: Joi.number().integer().min(1).required(),
    dateTime: Joi.date().min("now").required(),
    hallId: Joi.number().integer().min(1).required(),
    price: Joi.number().min(0.0).required()
});

const idSchema = Joi.object({
    id: Joi.number().integer().min(1)
});

const scheduleIdSchema = Joi.object({
    id: Joi.number().integer().min(1),
    movieId: Joi.number().integer().min(1).required(),
    dateTime: Joi.date().min("now").required(),
    hallId: Joi.number().integer().min(1).required(),
    price: Joi.number().min(0.0).required()
});

function checkSecurity(req, roles) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (token == null) return false;

    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    //console.log(JSON.parse(jsonPayload));
    return roles.includes(JSON.parse(jsonPayload).role);
}

// Create and Save a new Schedule
exports.create = (req, res) => {
    // check security
    security = checkSecurity(req, ["admin", "moderator"]);

    if (!security)
        res.status(401).send({ message: "You are not authorized!" });

    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Data validation
    const {error} = scheduleSchema.validate(req.body);

    if (error) {
        res.status(500).send({
            message: error.message
        });

        return;
    }

    // Create a Schedule
    const schedule = new Schedule({
        movieId: req.body.movieId,
        dateTime: req.body.dateTime,
        hallId: req.body.hallId,
        price: req.body.price
    });

    // Save Schedule in the database
    Schedule.create(schedule, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Schedule."
            });
        else
            res.send(data);
    });
};

// Retrieve all Schedules from the database
exports.findAll = (req, res) => {
    // check security
    security = checkSecurity(req, ["admin", "moderator"]);

    if (!security)
        res.status(401).send({ message: "You are not authorized!" });

    Schedule.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving schedules."
            });
        else
            res.send(data);
    });
};

// Update a Schedule identified by the id in the request
exports.update = (req, res) => {
    // check security
    security = checkSecurity(req, ["admin", "moderator"]);

    if (!security)
        res.status(401).send({ message: "You are not authorized!" });

    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Data validation
    const obj = req.body;
    obj.id = req.params.id;
    const {error} = scheduleIdSchema.validate(obj);

    if (error) {
        res.status(500).send({
            message: error.message
        });

        return;
    }

    Schedule.updateById(
        req.params.id,
        new Schedule(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Schedule with id ${req.params.id}.`
                    });
                }
                else {
                    res.status(500).send({
                        message: "Error updating Schedule with id " + req.params.id
                    });
                }
            }
            else res.send(data);
        }
    );
};

// Delete a Schedule with the specified id in the request
exports.delete = (req, res) => {
    // check security
    security = checkSecurity(req, ["admin", "moderator"]);

    if (!security)
        res.status(401).send({ message: "You are not authorized!" });

    // Data validation
    const {error} = idSchema.validate({ id: req.params.id });

    if (error) {
        res.status(500).send({
            message: error.message
        });

        return;
    }

    Schedule.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Schedule with id ${req.params.id}.`
                });
            }
            else {
                res.status(500).send({
                    message: "Could not delete Schedule with id " + req.params.id
                });
            }
        }
        else res.send({ message: `Schedule was deleted successfully!` });
    });
};