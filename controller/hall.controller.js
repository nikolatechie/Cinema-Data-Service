const Hall = require("../model/hall");

// Create and Save a new Hall
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Hall
    const hall = new Hall({
        floor: req.body.floor,
        capacity: req.body.capacity
    });

    // Save Hall in the database
    Hall.create(hall, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Hall."
            });
        else
            res.send(data);
    });
};

// Retrieve all Halls from the database
exports.findAll = (req, res) => {
    Hall.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving halls."
            });
        else
            res.send(data);
    });
};

// Update a Hall identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Hall.updateById(
        req.params.id,
        new Hall(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Hall with id ${req.params.id}.`
                    });
                }
                else {
                    res.status(500).send({
                        message: "Error updating Hall with id " + req.params.id
                    });
                }
            }
            else res.send(data);
        }
    );
};

// Delete a Hall with the specified id in the request
exports.delete = (req, res) => {
    Hall.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Hall with id ${req.params.id}.`
                });
            }
            else {
                res.status(500).send({
                    message: "Could not delete Hall with id " + req.params.id
                });
            }
        }
        else res.send({ message: `Hall was deleted successfully!` });
    });
};