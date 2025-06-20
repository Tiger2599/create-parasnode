import express from "express";
import cors from "cors";
import { cors_origin } from "./constants.js";
import router from "./routers/index.js";

const app = express();

app.use(
    cors({
        origin: cors_origin,
        credentials: true,
        methods: "GET, POST",
    })
);
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: true, limit: "20kb" }));

app.use("/api/v1", router);

export { app };
