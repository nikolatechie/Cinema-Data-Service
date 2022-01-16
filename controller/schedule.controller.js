const Schedule = require("../model/schedule");

// Create and Save a new Schedule
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
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
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
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