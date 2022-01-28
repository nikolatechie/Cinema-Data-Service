const sql = require("./db.js");
const bcrypt = require('bcrypt');

const User = function(user) {
    this.role = user.role;
    this.name = user.name;
    this.email = user.email;
    this.password = user.password;
};

User.create = async (newUser, result) => {
    try {
        newUser.password = await bcrypt.hash(newUser.password, 10);
    }
    catch {
        console.log('Error!');
        result('Error!', null);
    }

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

User.getByUser = async (user, result) => {
    sql.query(`SELECT * FROM user WHERE email = '${user.email}'`, async (err, res) => {
        if (err) {
            console.log("Error occurred!");
            result(err, null);
            return;
        }

        if (res.length && await bcrypt.compare(user.password, res[0].password)) {
            console.log("User found: ", {
                id: res[0].id,
                role: res[0].role,
                name: res[0].name,
                email: res[0].email
            });

            result(null, {
                id: res[0].id,
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

User.updateByEmail = async (user, result) => {
    if (user.name != null && user.name !== '') {
        sql.query(`UPDATE user SET name = ? WHERE email = ?`,
            [user.name, user.email]);
    }

    if (user.password != null && user.password !== '') {
        try {
            user.password = await bcrypt.hash(user.password, 10);
        }
        catch {
            console.log('Error!');
            result('Error!', null);
        }

        sql.query(`UPDATE user SET password = ? WHERE email = ?`,
            [user.password, user.email]);
    }

    if (user.newEmail != null && user.newEmail !== '') {
        sql.query(`UPDATE user SET email = ? WHERE email = ?`,
            [user.newEmail, user.email]);
    }

    result(null, { message: "User info updated!" })
}

User.updateById = async (id, user, result) => {
    try {
        user.password = await bcrypt.hash(user.password, 10);
    }
    catch {
        console.log('Error!');
        result('Error!', null);
    }

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