import dotenv from "dotenv"
import connectDB from "./db/index.js";
import {app}  from "./app.js"

dotenv.config({

    path: './.env'
})

connectDB()

.then(() => {

    app.listen(process.env.PORT || 8001, () =>{
        console.log(`Server is runnig on port ${process.env.PORT}`);

    })
})

.catch((err) => {

    console.log("MONGO db connection failed !!!",err);
})