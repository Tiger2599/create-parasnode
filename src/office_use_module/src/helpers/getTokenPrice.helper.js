import { sql } from "../DB/index.js";
import ApiCall from "./apiCall.js";

export const getTokenPrice = async () => {
    try {
        let { recordset } = await sql.query(
            `select [value] from cf_config where [key] = 'token_price'`
        );
        return recordset[0].value;
    } catch (err) {
        return false;
    }
};
