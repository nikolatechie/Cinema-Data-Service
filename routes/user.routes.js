module.exports = app => {
    const user = require("../controller/user.controller.js");
    var router = require("express").Router();

    // Create a new User
    router.post("/", user.create);

    // Read all users
    router.get("/", user.findAll);

    // Update a User with id
    router.put("/:id", user.update);

    // Delete a User with id
    router.delete("/:id", user.delete);

    app.use('/api/user', router);
};