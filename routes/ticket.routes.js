module.exports = app => {
    const ticket = require("../controller/ticket.controller.js");
    var router = require("express").Router();

    // Create a new Ticket
    router.post("/", ticket.create);

    // Get tickets' scheduleId for specific user
    router.get("/:id", ticket.findByUser);

    // Get all tickets for specific user
    router.get("/visits/:id", ticket.findByUserId);

    // Read all tickets
    router.get("/", ticket.findAll);

    // Update a Ticket with id
    router.put("/:id", ticket.update);

    // Delete a Ticket with id
    router.delete("/:id", ticket.delete);

    app.use('/api/ticket', router);
};