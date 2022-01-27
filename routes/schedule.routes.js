module.exports = app => {
    const schedule = require("../controller/schedule.controller.js");
    var router = require("express").Router();

    // Create a new Schedule
    router.post("/", schedule.create);

    // Read all schedules
    router.get("/", schedule.findAll);

    // Update a Schedule with id
    router.put("/:id", schedule.update);

    // Delete a Schedule with id
    router.delete("/:id", schedule.delete);

    app.use('/api/schedule', router);
};