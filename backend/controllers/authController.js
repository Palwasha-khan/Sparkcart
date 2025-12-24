import catchAsyncErrors from "../middleware/catchAsyncErrors.js"
import User from "../models/user.js"
import ErrorHandler from "../utils/errorHandler.js";
import sendToken from "../utils/sendToken.js";

//regiter user   api/v1/register
export const registerUser = catchAsyncErrors(async(req,res,next)=>{
    const{name,email,password} = req.body;

    const user = await User.create({
        name,
        email,
        password,
    })

    sendToken(user,200,res);
})


//login user  => api/v1/login
export const loginUser = catchAsyncErrors(async(req,res,next)=>{
    const {email,password} = req.body;

    if(!email || !password){
        return next(new ErrorHandler('Please enter email & password', 400))
    }

    //find user in the database
    const user = await User.findOne({ email}).select("+password")

    if(!email){
        return next(new ErrorHandler('Invalid  email & password', 401))
    }

    //check if password is correct
    const isPasswordMatched = await user.comparePassword(password)
    if(!isPasswordMatched){
        return next(new ErrorHandler('Invalid  email & password', 401))
    }

    sendToken(user,200,res);
});

//logout user  => api/v1/logout
export const logoutUser = catchAsyncErrors(async(req,res,next)=>{
    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httponly:true,
    });

    res.status(200).json({
        message:"logged out",
    })
})
 