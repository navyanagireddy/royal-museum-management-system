const mysql = require('mysql');
const dbConfig = require('../config/database');

const connection = mysql.createConnection(dbConfig);

const MuseumModel = {
    findAll: (callback) => {
        connection.query('SELECT * FROM museums', (error, results) => {
            if (error) {
                return callback(error, null);
            }
            callback(null, results);
        });
    },

    findById: (id, callback) => {
        connection.query('SELECT * FROM museums WHERE id = ?', [id], (error, results) => {
            if (error) {
                return callback(error, null);
            }
            callback(null, results[0]);
        });
    }
};

module.exports = MuseumModel;