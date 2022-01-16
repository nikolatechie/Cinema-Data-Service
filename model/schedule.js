const sql = require("./db.js");

const Schedule = function(schedule) {
    this.movieId = schedule.movieId;
    this.dateTime = schedule.dateTime;
    this.hallId = schedule.hallId;
    this.price = schedule.price;
};

Schedule.create = (newSchedule, result) => {
    sql.query("INSERT INTO schedule SET ?", newSchedule, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created schedule: ", { id: res.insertId, ...newSchedule });
        result(null, { id: res.insertId, ...newSchedule });
    });
};

Schedule.findById = (id, result) => {
    sql.query(`SELECT * FROM schedule WHERE id = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found schedule: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found Schedule with the id
        result({ kind: "not_found" }, null);
    });
};

Schedule.getAll = (result) => {
    let query = "SELECT * FROM schedule";

    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("schedule: ", res);
        result(null, res);
    });
};

Schedule.updateById = (id, schedule, result) => {
    sql.query(
        "UPDATE schedule SET movie_id = ?, date_time = ?, hall_id = ?, price = ? WHERE id = ?",
        [schedule.movieId, schedule.dateTime, schedule.hallId, schedule.price, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found Schedule with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated schedule: ", { id: id, ...schedule });
            result(null, { id: id, ...schedule });
        }
    );
};

Schedule.remove = (id, result) => {
    sql.query("DELETE FROM schedule WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found Schedule with the id
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted schedule with id: ", id);
        result(null, res);
    });
};

module.exports = Schedule;