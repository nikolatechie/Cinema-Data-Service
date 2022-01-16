module.exports = app => {
    const hall = require("../controller/hall.controller.js");
    var router = require("express").Router();

    // Create a new Hall
    router.post("/", hall.create);

    // Read all halls
    router.get("/", hall.findAll);

    // Update a Hall with id
    router.put("/:id", hall.update);

    // Delete a Hall with id
    router.delete("/:id", hall.delete);

    app.use('/api/hall', router);
};