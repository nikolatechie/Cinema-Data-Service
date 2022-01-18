const sql = require("./db.js");

const User = function(user) {
    this.role = user.role;
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
};

User.create = (newUser, result) => {
    sql.query("INSERT INTO user SET ?", newUser, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created user: ", { id: res.insertId, ...newUser });
        result(null, { id: res.insertId, ...newUser });
    });
};

User.getByUser = (user, result) => {
    sql.query(`SELECT * FROM user WHERE email LIKE '${user.email}' AND password LIKE '${user.password}'`, (err, res) => {
        if (err) {
            console.log("Error occurred!");
            result(err, null);
            returnl
        }

        if (res.length) {
            console.log("User found: ", {
                id: res[0].id,
                role: res[0].role,
                name: res[0].name,
                email: res[0].email
            });

            result(null, {
                role: res[0].role,
                email: res[0].email,
                password: res[0].password
            });

            return;
        }

        result({ kind: "not_found" }, null);
    });
}

User.findById = (id, result) => {
    sql.query(`SELECT * FROM user WHERE id = ${id}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found user: ", res[0]);
            result(null, res[0]);
            return;
        }

        // not found User with the id
        result({ kind: "not_found" }, null);
    });
};

User.getAll = (result) => {
    let query = "SELECT * FROM user";

    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("user: ", res);
        result(null, res);
    });
};

User.updateById = (id, user, result) => {
    sql.query(
        "UPDATE user SET role = ?, name = ?, email = ?, password = ? WHERE id = ?",
        [user.role, user.name, user.email, user.password, id],
        (err, res) => {
            if (err) {
                console.log("error: ", err);
                result(null, err);
                return;
            }

            if (res.affectedRows == 0) {
                // not found User with the id
                result({ kind: "not_found" }, null);
                return;
            }

            console.log("updated user: ", { id: id, ...user });
            result(null, { id: id, ...user });
        }
    );
};

User.remove = (id, result) => {
    sql.query("DELETE FROM user WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found User with the id
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("deleted user with id: ", id);
        result(null, res);
    });
};

module.exports = User;