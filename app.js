// express
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// routes
require("./routes/movie.routes")(app);
require("./routes/hall.routes")(app);
require("./routes/schedule.routes")(app);
require("./routes/user.routes")(app);
require("./routes/ticket.routes")(app);


app.listen(8080);