import sql from "mssql";
import { dbHost, dbName, dbPass, dbUser } from "../constants.js";

const dbConfig = {
    user: dbUser,
    password: dbPass,
    server: dbHost,
    database: dbName,
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000,
    },
};

const connectDB = async () => {
    try {
        const pool = await sql.connect(dbConfig);
        console.log("✅ MSSQL Connected");
        return pool;
    } catch (err) {
        console.error("❌ DB Connection Failed:", err);
        throw err;
    }
};

export default connectDB;
export { sql };
