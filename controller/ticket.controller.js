const Ticket = require("../model/ticket");
const Joi = require("joi");
const roleAuth = require("../security/role.authorization");

// Validation schemas
const ticketSchema = Joi.object({
    scheduleId: Joi.number().integer().min(1).required(),
    seatNum: Joi.number().integer().min(1).max(10000).required(),
    userId: Joi.number().integer().min(1).required()
});

const idSchema = Joi.object({
    id: Joi.number().integer().min(1)
});

const ticketIdSchema = Joi.object({
    id: Joi.number().integer().min(1),
    scheduleId: Joi.number().integer().min(1).required(),
    seatNum: Joi.number().integer().min(1).max(10000).required(),
    userId: Joi.number().integer().min(1).required()
});

// Create and Save a new Ticket
exports.create = (req, res) => {
    // check security
    security = roleAuth.checkSecurity(req, ["admin", "moderator"]);

    if (!security)
        res.status(401).send({ message: "You are not authorized!" });

    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Data validation
    const {error} = ticketSchema.validate(req.body);

    if (error) {
        res.status(500).send({
            message: error.message
        });

        return;
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
    // check security
    security = roleAuth.checkSecurity(req, ["admin", "moderator"]);

    if (!security)
        res.status(401).send({ message: "You are not authorized!" });

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
    // check security
    security = roleAuth.checkSecurity(req, ["admin", "moderator"]);

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
    const {error} = ticketIdSchema.validate(obj);

    if (error) {
        res.status(500).send({
            message: error.message
        });

        return;
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
    // check security
    security = roleAuth.checkSecurity(req, ["admin", "moderator"]);

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