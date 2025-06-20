import jwt from "jsonwebtoken";
import { sql } from "../DB/index.js";
import { token_age, token_secret } from "../constants.js";

class tokenHandler {
    constructor() {
        this.token_secret = token_secret;
        this.token_age = token_age;
    }

    verifyToken = async (req, res, next) => {
        try {
            const token = req.header("Authorization")?.replace("Bearer ", "");

            if (!token) {
                return res.status(401).json({
                    status: "Fail",
                    msg: "Unauthorized request",
                });
            }

            const { mid, uuid } = await jwt.verify(token, this.token_secret);

            const { recordset } = await sql.query(`
                exec SP_getUser 
                    @mode = 'get_user'
                    ,@uuid = '${uuid}'
            `);

            if (recordset[0].msgcode !== "Success") {
                return res.status(401).json({
                    status: "Fail",
                    msg: "Invalid Access Token",
                });
            }

            delete recordset[0].msgcode;
            delete recordset[0].msg;

            req.userId = { mid, uuid };
            req.user = recordset[0];
            next();
        } catch (err) {
            return res.status(401).json({
                status: "Fail",
                msg: "Invalid access token",
            });
        }
    };

    generateTokens = async (user) => {
        try {
            return await jwt.sign({ ...user }, this.token_secret, {
                expiresIn: this.token_age,
            });
        } catch (err) {
            return false;
        }
    };
}

export default new tokenHandler();
