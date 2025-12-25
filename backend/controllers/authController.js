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
 
//get current user profile =>/api/v1/me
export const getUserProfile = catchAsyncErrors(async(req,res,next) =>{
    const user = await User.findById(req?.user?._id);

    res.status(200).json({
        user,
    })
})

//update password =>/api/v1/password/update
export const updatePassword = catchAsyncErrors(async(req,res,next) =>{
    const user = await User.findById(req?.user?._id).select("+password");

    //check the previous pass 
    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler('old password is incorrect ', 401))
    }

    user.password = req.body.password;
    user.save();

    res.status(200).json({
        success:true,
    })
})

//update profile =>/api/v1/me/update
export const updateProfile = catchAsyncErrors(async(req,res,next) =>{
   
    const newUserData = {
        name: req.body.name,
        email:req.body.email,
    };

    const user = await User.findByIdAndUpdate(req.user._id, newUserData,{new:true});

    

    res.status(200).json({
        user,
    })
})

//get all users =>/api/v1/admin/users
export const allUsers = catchAsyncErrors(async(req,res,next) =>{
   
    const users = await User.find();
    res.status(200).json({
        users,
    })
})

//get user details =>/api/v1/admin/users/:id
export const getUserDetail = catchAsyncErrors(async(req,res,next) =>{
   
    const user = await User.findById(req.params.id);

    if(!user){
          return next
          (new ErrorHandler('user not found with id : ${req.params.id} ', 401))
   
    }
    res.status(200).json({
        user,
    })
})


//update user profile - Admin =>/api/v1/admin/users/:id
export const updateUser = catchAsyncErrors(async(req,res,next) =>{
   
    const newUserData = {
        name: req.body.name,
        email:req.body.email,
        role:req.body.role,
    };

    const user = await User.findByIdAndUpdate(req.user._id, newUserData,{new:true});
    res.status(200).json({
        user,
    })
})

//delete user profile - Admin =>/api/v1/admin/users/:id
export const deleteUser = catchAsyncErrors(async(req,res,next) =>{
    
    const user = await User.findById(req.user.id);

     if(!user){
          return next
          (new ErrorHandler('user not found with id : ${req.params.id} ', 401))
    }

    await user.deleteOne();
    
    res.status(200).json({
        user,
    })
})
