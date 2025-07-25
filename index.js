const express = require("express")
const cookieParser = require("cookie-parser");
const cors = require("cors")
const dotenv = require("dotenv");
const connectDb = require("./Config/DbConnect");


dotenv.config()


const PORT = process.env.PORT;
const app = express()

//Database connection
connectDb()
app.listen(PORT, () => {
    console.log(`Server is running on this port ${PORT}`);
})