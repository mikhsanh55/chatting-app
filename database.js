const mysql = require('mysql2');
let db = null;

class DB {
    constructor() {
        db = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'vue-chat'
        });

        db.connect(function(err) {
            if(err) console.error(err);
        });
    }

    async storeUser(data) {
        try {
            if(await this.isUserExist(data)) {
                return Promise.resolve(true)
            }

            db.execute(
                "INSERT INTO users (name, user_id) VALUE (?,?)",
                [data.name, data.user_id],
                function(err, rows) {
                    if(err) return Promise.reject(err);
                    return Promise.resolve(rows);
                }
            );
        }
        catch(e) {
            return Promise.reject(e)
        }
    }

    async isUserExist(data) {
        db.execute(
            "SELECT * FROM users WHERE name = ?",
            [data.name],
            function(err, rows) {
                if(err) return Promise.reject(err);
                return Promise.resolve(rows[0]);
            }
        );
    }

    async fetchUserMessages (data) {
        const messages = [];

        db.query(
            "SELECT * FROM messages where name = ?",
            [data.name],
            function(err, rows) {
                if(err) return Promise.reject(err);
                return Promise.resolve(rows);
            }
        );
    }

    async storeUserMessage(data) {
        db.query(
            "INSERT INTO messages (message, user_id, name) VALUES(?, ?, ?)",
            [data.message, data.user_id, data.name],
            function(err, rows) {
                if(err) return Promise.reject(err);
                return Promise.resolve(rows);
            }
        );
    }
}

module.exports = DB;