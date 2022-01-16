const Ticket = require("../model/ticket");

// Create and Save a new Ticket
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Create a Ticket
    const ticket = new Ticket({
        scheduleId: req.body.scheduleId,
        seatNum: req.body.seatNum,
        userId: req.body.userId
    });

    // Save Ticket in the database
    Ticket.create(ticket, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Ticket."
            });
        else
            res.send(data);
    });
};

// Retrieve all Tickets from the database
exports.findAll = (req, res) => {
    Ticket.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving tickets."
            });
        else
            res.send(data);
    });
};

// Update a Ticket identified by the id in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Ticket.updateById(
        req.params.id,
        new Ticket(req.body),
        (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found Ticket with id ${req.params.id}.`
                    });
                }
                else {
                    res.status(500).send({
                        message: "Error updating Ticket with id " + req.params.id
                    });
                }
            }
            else res.send(data);
        }
    );
};

// Delete a Ticket with the specified id in the request
exports.delete = (req, res) => {
    Ticket.remove(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found Ticket with id ${req.params.id}.`
                });
            }
            else {
                res.status(500).send({
                    message: "Could not delete Ticket with id " + req.params.id
                });
            }
        }
        else res.send({ message: `Ticket was deleted successfully!` });
    });
};