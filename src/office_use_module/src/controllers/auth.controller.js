import tokenHandler from '../middlewares/auth.middleware.js'
import { sql } from "../DB/index.js";

class AuthController {
    constructor() {
        this.loginUser = this.loginUser.bind(this);
    }

    loginUser = async (req, res) => {
        try {
            const { uuid: userID } = req.body;
            const fname = '', lname = '', point = 0;

            if ([userID].some(e => typeof e !== "string" || e.trim() === "")) {
                return res.status(400).json({ status: "Fail", msg: "All fields are required." });
            }

            const safePoint = Number.isInteger(point) ? point : 0;
            const { recordset } = await sql.query(`
                exec SP_login 
                    @mode = 'login',
                    @uuid = '${userID}',
                    @fname = '${fname.replace(/'/g, "''")}',
                    @lname = '${lname.replace(/'/g, "''")}',
                    @point = ${safePoint}
            `);
            const { msg, msgcode, mid, uuid } = recordset[0];

            if (msgcode !== "Success") {
                return res.status(400).json({ status: "Fail", msg });
            }

            return res.status(200).json({
                status: "Success",
                msg,
                Token: tokenHandler.generateTokens({ mid, uuid }),
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ status: "Fail", msg: "Internal server error. Please try again later." });
        }
    }
}

export default new AuthController();