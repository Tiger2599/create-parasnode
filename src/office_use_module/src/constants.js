import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 3002;
const cors_origin = ["http://192.168.0.153:3000", "http://157.119.42.117:8001"];
const token_secret = process.env.ACCESS_TOKEN_SECRET;
const token_age = process.env.ACCESS_TOKEN_AGE;

import { contract_abi } from "./ABI/contract_abi.js";
const rpc = process.env.RPC;
const token_address = process.env.TOKEN_ADDRESS;
const contract_address = process.env.CONTRACT_ADDRESS;
const privateKey = process.env.PRIVATE_KEY;

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;

export {
    port,
    cors_origin,
    token_secret,
    token_age,
    contract_abi,
    rpc,
    token_address,
    contract_address,
    privateKey,
    dbUser,
    dbPass,
    dbHost,
    dbName
};
