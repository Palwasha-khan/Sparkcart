import catchAsyncErrors from "../middleware/catchAsyncErrors.js"
import User from "../models/user.js"
import { delete_file, upload_file } from "../utils/cloudinary.js";
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

   if (!user) {
    console.log("DEBUG: No user found with email:", email);
    return next(new ErrorHandler('Invalid email & password', 401));
}

console.log("DEBUG: Entered Password:", password);
console.log("DEBUG: Hashed Password in DB:", user.password);

const isPasswordMatched = await user.comparePassword(password);
console.log("DEBUG: Match Result:", isPasswordMatched);

    //check if password is correct 
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
 
//upload avatar  => api/v1/me/upload_avatar
export const uploadAvatar = catchAsyncErrors(async(req,res,next)=>{
     const avatarResponse = await upload_file(req.body.avatar, "shopit/avatars")

     const user = await User.findByIdAndUpdate(req?.user?._id,{
        avatar: avatarResponse,
     })
     
    res.status(200).json({
        user,
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


//admin routes

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


// Update user profile - Admin => /api/v1/admin/users/:id
export const updateUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, role } = req.body;
 

    // 1. You MUST define it here first
    const existingUser = await User.findOne({ email });
 
    

    // 3. The logic check
    if (existingUser && existingUser._id.toString() !== req.params.id) {
        return next(new ErrorHandler("This email is already taken by another user", 400));
    }

    const user = await User.findByIdAndUpdate(req.params.id, { name, email, role }, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        success: true,
        user,
    });
});


//delete user profile - Admin =>/api/v1/admin/users/:id
export const deleteUser = catchAsyncErrors(async(req,res,next) =>{
    
    const user = await User.findById(req.params.id);

     if(!user){
          return next
          (new ErrorHandler('user not found with id : ${req.params.id} ', 401))
    };
    if (user._id.toString() === req.user._id.toString()) {
        return next(new ErrorHandler("You cannot delete your own account", 400));
    }
   // Check if the user exists and has an avatar with a public_id
        if (user?.avatar?.public_id) {
            try {
                await delete_file(user.avatar.public_id);
            } catch (error) {
                // Log the error but don't stop the user deletion process
                console.error("Cloudinary delete failed:", error.message);
            }
        }
    await user.deleteOne();
    
    res.status(200).json({
        user,
    })
})
