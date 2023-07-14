const mongoose = require("mongoose");
const bcrypt = require("bcryptjs")


const usermodel = mongoose.Schema({
    name : {
        type : String,
        require : true
    },
    email : {
        type : String,
        require : true,
        unique : true
    },
    password : {
        type : String,
        require : true
    },
    pic : {
        type : String,
        require : true,
        default : "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    }
},{
    timestamps : true
})

usermodel.methods.matchPassword = async function(enterpassword){
    return await bcrypt.compare(enterpassword,this.password);
}

usermodel.pre("save",async function(next){
    if(!this.isModified){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
});

const User = mongoose.model("User",usermodel);

module.exports = User;