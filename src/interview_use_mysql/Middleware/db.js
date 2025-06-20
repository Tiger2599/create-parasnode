const pool = require("../connection");

exports.SP = async (spName, json = {}) => {
    const connection = await pool.getConnection();

    try {
        let sql = `CALL ${spName}(`;

        const values = Object.values(json).map(value => `'${value}'`);
        sql += values.join(',') + ');';

        console.log("🦉 ~ SQL:", sql);

        const [results] = await connection.query(sql);
        return results;
    } catch (err) {
        console.error("SP execution error:", err);
        throw err;
    } finally {
        connection.release();
    }
};

exports.onlyselectquery = async (query) => {
    console.log("🦉 ~ SQL:", query);
    const connection = await pool.getConnection();
    const [results] = await connection.execute(query);
    connection.release();
    return results;
};
