// express
const express = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// routes
require("./routes/movie.routes")(app);
require("./routes/hall.routes")(app);


app.listen(8080);