// express
const express = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// routes
require("./routes/movie.routes")(app);
require("./routes/hall.routes")(app);
require("./routes/schedule.routes")(app);
require("./routes/user.routes")(app);
require("./routes/ticket.routes")(app);


app.listen(8080);