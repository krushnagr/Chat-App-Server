const express = require("express");
// const chats = require("./dummyData");
const dotenv = require("dotenv")
const cors = require("cors");
const connectDB = require("./config/db");
const UserRouter = require("./routers/UserRouter")
const chatRoutes = require("./routers/chatRouter")
const {notFound, ErrorHandeler } = require("./middleWare/ErrorMiddleWare")

const app = express();
app.use(cors())
app.use(express.json());
dotenv.config();
connectDB();
const port = process.env.Port || 4000;


app.use('/api/user',UserRouter);
app.use("/api/chat", chatRoutes);


app.use(notFound);
app.use(ErrorHandeler);



app.listen(port, () => {
    console.log(`Server is Connected to port : ${port}`);
})