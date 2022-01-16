module.exports = app => {
    const movie = require("../controller/movie.controller.js");
    var router = require("express").Router();

    // Create a new Movie
    router.post("/", movie.create);

    // Read all movies
    router.get("/", movie.findAll);

    // Update a Movie with id
    router.put("/:id", movie.update);

    // Delete a Movie with id
    router.delete("/:id", movie.delete);

    app.use('/api/movie', router);
};