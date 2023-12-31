const asyncHandler = require("express-async-handler");
const Chat = require("../models/ChatModel");
const User = require("../models/UserModel");

exports.accectChat = asyncHandler(async(req,res)=>{
    const {userId} = req.body;

    if(!userId){
        console.log("UserId params not send with rquest");
        return res.sendStatus(400);
    }
    var isChat = await Chat.find({
        isGroupChat: false,
        $and : [
            {users : {$elemMatch: {$eq : req.user._id}}},
            {users : {$elemMatch: {$eq: userId}}}
        ],
    }).populate("users","-password").populate("latestMassage")
    isChat = await User.populate(isChat,{
        path : "latestMassage.sender",
        select : "name pic email",
    });
    // console.log(isChat);
    if (isChat.length > 0) {
        res.send(isChat[0]);
      } else {
        var chatData = {
          chatName: "sender",
          isGroupChat: false,
          users: [req.user._id, userId],
        };
    
        try {
          const createdChat = await Chat.create(chatData);
          const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
            "users",
            "-password"
          );
          res.status(200).json(FullChat);
        } catch (error) {
          res.status(400);
          throw new Error(error.message);
        }
      }
})

exports.fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMassage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMassage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
})

exports.createGroup = asyncHandler(async(req,res)=>{
  if(!req.body.users || !req.body.name){
    return res.status(400).send({message : "Please Fill All fields"})
  }
  var users = JSON.parse(req.body.users);
  if (users.length<2) {
    return res.status(400).send("More then two user are required to from a group");
  }
  users.push(req.user);

  try{
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
  
})

exports.renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

exports.addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const isUser = await Chat.findById(chatId);
  // console.log(isUser);
  if(isUser.users.includes(userId)){
    res.status(404);
    throw new Error(`User already in group`)
  }
  
  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});

exports.removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});
