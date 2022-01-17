const Hall = require("../model/hall");
const Joi = require("joi");

// Validation schemas
const hallSchema = Joi.object({
    floor: Joi.number().min(1).max(1000).required(),
    capacity: Joi.number().min(0).max(10000).required()
});

const idSchema = Joi.object({
    id: Joi.number().integer().min(1)
});

const hallIdSchema = Joi.object({
    id: Joi.number().integer().min(1),
    floor: Joi.number().min(1).max(1000).required(),
    capacity: Joi.number().min(0).max(10000).required()
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

// Create and Save a new Hall
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
    const {error} = hallSchema.validate(req.body);

    if (error) {
        res.status(500).send({
            message: error.message
        });

        return;
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
                message: err.message || "Some error occurred while creating the Hall."
            });
        else
            res.send(data);
    });
};

// Retrieve all Halls from the database
exports.findAll = (req, res) => {
    // check security
    security = checkSecurity(req, ["admin", "moderator"]);

    if (!security)
        res.status(401).send({ message: "You are not authorized!" });

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
    const {error} = hallIdSchema.validate(obj);

    if (error) {
        res.status(500).send({
            message: error.message
        });

        return;
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
    // check security
    security = checkSecurity(req, ["admin", "moderator"]);

    if (!security)
        res.status(401).send({ message: "You are not authorized!" });

    // Data validation
    const {error} = idSchema.validate({ id: req.params.id});

    if (error) {
        res.status(500).send({
            message: error.message
        });

        return;
    }

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