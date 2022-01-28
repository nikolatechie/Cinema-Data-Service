module.exports = app => {
    const user = require("../controller/user.controller.js");
    var router = require("express").Router();

    // Create a new User
    router.post("/", user.create);

    // Check if exists by given email and password
    router.post("/login", user.getByUser);

    // Read all users
    router.get("/", user.findAll);

    // Update user with given id
    router.put("/", user.updateByEmail);

    // Update a User with id
    router.put("/:id", user.update);

    // Delete a User with id
    router.delete("/:id", user.delete);

    app.use('/api/user', router);
};