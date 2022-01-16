const sql = require("./db.js");

const Hall = function(hall) {
    this.floor = hall.floor;
    this.capacity = hall.capacity;
};

Hall.create = (newHall, result) => {
    sql.query("INSERT INTO hall SET ?", newHall, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created hall: ", { id: res.insertId, ...newHall });
        result(null, { id: res.insertId, ...newHall });
    });
};

Hall.findById = (id, result) => {
    sql.query(`SELECT * FROM hall WHERE id = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found hall: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Hall with the id
        result({ kind: "not_found" }, null);
    });
};

Hall.getAll = (result) => {
    let query = "SELECT * FROM hall";

    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("hall: ", res);
        result(null, res);
    });
};

Hall.updateById = (id, hall, result) => {
    sql.query(
        "UPDATE hall SET floor = ?, capacity = ? WHERE id = ?",
        [hall.floor, hall.capacity, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Hall with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated hall: ", { id: id, ...hall });
            result(null, { id: id, ...hall });
        }
    );
};

Hall.remove = (id, result) => {
    sql.query("DELETE FROM hall WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found Hall with the id
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted hall with id: ", id);
        result(null, res);
    });
};

module.exports = Hall;