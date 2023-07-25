const express = require("express");
// const chats = require("./dummyData");
const dotenv = require("dotenv")
const cors = require("cors");
const connectDB = require("./config/db");
const UserRouter = require("./routers/UserRouter")
const chatRoutes = require("./routers/chatRouter")
const MessageRoutes = require("./routers/Message")
const {notFound, ErrorHandeler } = require("./middleWare/ErrorMiddleWare")

const app = express();
app.use(cors())
app.use(express.json());
dotenv.config();
connectDB();
const port = process.env.Port || 4000;


app.use('/api/user',UserRouter);
app.use("/api/chat", chatRoutes);
app.use("/api/message",MessageRoutes);


app.use(notFound);
app.use(ErrorHandeler);



const server = app.listen(port, () => {
    console.log(`Server is Connected to port : ${port}`);
});

const io = require("socket.io")(server,{
    pingTimeout : 60000,
    cors : {
        origin : "http://localhost:3000"
    }
})

io.on("connection",(socket)=>{
    console.log("Connected to socket.io");
    socket.on("setup",(userData)=>{
        socket.join(userData._id)
        socket.emit("connected");
    })
    socket.on("join chat",(room)=>{
        socket.join(room)
        console.log("User join room : "+ room);
    })

    socket.on("typing",(room)=>socket.in(room).emit("typing"));
    socket.on("stop typing",(room)=>socket.in(room).emit("stop typing"));
    
    socket.on("new message",(newMessageRecieved)=>{
        var chat = newMessageRecieved.chat;
        if(!chat.users)return console.log("chat.users not defined");
        chat.users.forEach((user) => {
            if(user._id==newMessageRecieved.sender._id)return;
            socket.in(user._id).emit("message recieved", newMessageRecieved);
        });
    })
})
