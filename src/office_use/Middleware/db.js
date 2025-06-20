var requests = require("../connection"); 

exports.SP = async (spName, json) => {
    var sql = "exec " + spName + " ";
    Object.keys(json).forEach(function (key) {
        sql += " @" + key + "='" + json[key] + "',";
    });
    var sql = sql.substring(0, sql.lastIndexOf(","));
    console.log(sql);
    return new Promise((resolve, reject) => {
        requests.query(sql, function (err, result) {
            if (err) {
                reject(err);
            }
            resolve(result);
        })
    })
};

exports.selectquery = async (tablename, where, select = '', jointable = '', orderby = '') => {
    var sql = "select ";
    if (select.length > 0) {
        sql += select.join();
    } else {
        sql += "*";
    }
    sql += " from " + tablename;
    if (Object.keys(jointable).length > 0) {

        Object.keys(jointable).forEach(function (key) {
            sql += " " + key + " on " + jointable[key];
        });

    }
    var count = Object.keys(where).length;
    if (count) {
        sql += " where ";
        Object.keys(where).forEach(function (key) {
            sql += " " + key + "='" + where[key] + "' and";
        });
    }
    var sql = sql.substring(0, sql.lastIndexOf("and"));

    if (orderby != "") {
        sql += " " + orderby;
    }
    console.log(sql);
    return new Promise((resolve, reject) => {
        requests.query(sql, function (err, result) {
            if (err) {
                reject(err);
            }
            resolve(result);
        })
    })
};

exports.onlyselectquery = async (sql) => {
    return new Promise((resolve, reject) => {
        requests.query(sql, function (err, result) {
            if (err) {
                reject(err);
            }
            resolve(result);
        })
    })
};

exports.insertquery = async (tablename, value) => {
    var sql = "insert into " + tablename;
    var count = Object.keys(value).length;
    var keys = '', values = '';
    if (count) {
        Object.keys(value).forEach(function (key) {
            keys += key + ",";
            values += "'" + value[key] + "',";
        });
    }
    var keys = keys.substring(0, keys.lastIndexOf(","));
    var values = values.substring(0, values.lastIndexOf(","));
    sql += "(" + keys + ") values (" + values + ")";
    return new Promise((resolve, reject) => {
        requests.query(sql, function (err, result) {
            if (err) {
                reject(err);
            }
            resolve(result);
        })
    })
};

exports.updatequery = async (tablename, set, where = '') => {
    var sql = "update " + tablename;
    var count = Object.keys(set).length;

    if (count) {
        sql += " set ";
        Object.keys(set).forEach(function (key) {
            if (set[key] != undefined) {
                sql += " " + key + "='" + set[key] + "' ,";
            }
        });
    }
    var sql = sql.substring(0, sql.lastIndexOf(","));
    if (where) {
        sql += " where "
        Object.keys(where).forEach(function (key) {
            sql += " " + key + "='" + where[key] + "' and";
        });
    }
    var sql = sql.substring(0, sql.lastIndexOf("and"));
    console.log(sql);
    return new Promise((resolve, reject) => {
        requests.query(sql, function (err, result) {
            if (err) {
                reject(err);
            }
            resolve(result);
        })
    })
};