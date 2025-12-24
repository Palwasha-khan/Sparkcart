import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
const userSchema = new mongoose.Schema({
     name:{
        type:String,
        required: [true,"please enter your name"],
        maxLength : [30,"product name cannot exceed 30 characters"]
    },
     email:{
        type:String,
        required: [true,"please enter your email "],
        unique: true,
    },
     password:{
        type:String,
        required: [true,"please enter your password"],
        minLength : [6,"password must be longer than 6 characters"],
        select: false,
    },
     avatar:{
        public_id: String, 
        url:String,
    },
    role:{
        type:String,
        default:"user",
    },
    resetPasswordToken:String,
    resetPasswordExpire: Date,
},{timestamps:true})

//Encrypting password before saving the user
userSchema.pre("save",async function  (next) {
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password,10)
})

//Return jwt token
userSchema.methods.getJwtToken = function(){
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_TIME,
    })
}

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password)
}

export default mongoose.model("User",userSchema)