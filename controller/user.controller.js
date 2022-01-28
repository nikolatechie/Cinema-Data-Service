const User = require("../model/user");
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const roleAuth = require("../security/role.authorization");

/*
    ROLES:
    (1) Admin can do everything
    (2) Moderators create, update and delete movies, schedules...
    (3) Clients can buy tickets for movies
*/
const rolePattern = "client";

// Validation schemas
const userSchema = Joi.object({
    role: Joi.string().regex(RegExp(rolePattern)).required(),
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required()
});

const idSchema = Joi.object({
    id: Joi.number().integer().min(1)
});

const userIdSchema = Joi.object({
    id: Joi.number().integer().min(1),
    role: Joi.string().regex(RegExp(rolePattern)).required(),
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required()
});

const loginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required()
});

// Create and Save a new User
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    // Data validation
    const {error} = userSchema.validate(req.body);

    if (error) {
        res.status(500).send({
            message: error.message
        });

        return;
    }

    // Create a User
    const user = new User({
        role: req.body.role,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    });

    // Save User in the database
    User.create(user, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the User."
            });
        else
            res.send(data);
    });
};

// Check if user exists by given parameters
exports.getByUser = (req, res) => {
    // validation
    const {error} = loginSchema.validate(req.body);

    if (error)
        res.status(500).send({ message: "User parameters invalid!" });
    else {
        User.getByUser(req.body, (err, data) => {
            if (err)
                res.status(500).send({message: err.message});
            else {
                res.send({
                    token: jwt.sign(data, "key")
                })
            }
        });
    }
}

// Retrieve all Users from the database
exports.findAll = (req, res) => {
    // check security
    let security = roleAuth.checkSecurity(req, ["admin"]);

    if (!security)
        res.status(401).send({ message: "You are not authorized!" });
    else {
        User.getAll((err, data) => {
            if (err)
                res.status(500).send({
                    message:
                        err.message || "Some error occurred while retrieving users."
                });
            else
                res.send(data);
        });
    }
};

// Update user with the given email
exports.updateByEmail = (req, res) => {
    User.updateByEmail(req.body, (err, data) => {
        if (err)
            res.status(500).send({
                message: err.message
            })
        else res.send(data);
    })
}

// Update a User identified by the id in the request
exports.update = (req, res) => {
    // check security
    let security = roleAuth.checkSecurity(req, ["admin"]);

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
        const {error} = userIdSchema.validate(obj);

        if (error) {
            res.status(500).send({
                message: error.message
            });

            return;
        }

        User.updateById(
            req.params.id,
            new User(obj),
            (err, data) => {
                if (err) {
                    if (err.kind === "not_found") {
                        res.status(404).send({
                            message: `Not found User with id ${req.params.id}.`
                        });
                    } else {
                        res.status(500).send({
                            message: "Error updating User with id " + req.params.id
                        });
                    }
                } else res.send(data);
            }
        );
    }
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
    // check security
    let security = roleAuth.checkSecurity(req, ["admin"]);

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

        User.remove(req.params.id, (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found User with id ${req.params.id}.`
                    });
                } else {
                    res.status(500).send({
                        message: "Could not delete User with id " + req.params.id
                    });
                }
            } else res.send({message: `User was deleted successfully!`});
        });
    }
};