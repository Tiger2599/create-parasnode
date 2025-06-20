var sql = require("mssql");

sql.connect(`Data Source=${process.env.DB_HOST};Initial Catalog=${process.env.DB_NAME};Persist Security Info=True;User ID=${process.env.DB_USER};Password=${process.env.DB_PASS}`,
function (err) {
    if (err) {
        console.log('Connection Error');
        console.log(err);
    } else {
        console.log("connect");
    }
});

module.exports = new sql.Request(); 