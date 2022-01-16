const express = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.json({ message: "Ohkaayy lez gooah" });
});

require("./routes/movie.routes")(app);


app.listen(8080);