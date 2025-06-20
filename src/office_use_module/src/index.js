import connectDB from "./DB/index.js";
import { app } from "./app.js";
import { port } from "./constants.js";

connectDB()
    .then(() => {
        app.listen(port, (err) => {
            if(err){
                console.log(err);
            }
            console.log(`🚀 Server running at http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error("Failed to start server due to DB error:", err.message);
    });
