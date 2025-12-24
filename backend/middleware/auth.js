import catchAsyncErrors  from "./catchAsyncErrors.js";
import ErrorHandler from "../utils/errorHandler.js";
import user from "../models/user.js";
import jwt from "jsonwebtoken";

//checks if user is authenticated or not
export const isAthenticatedUser = catchAsyncErrors(async(req,res,next)=>{
    const {token} = req.cookies;

    if(!token){
        return next(new ErrorHandler("login first to access this resource",401));
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.user = await user.findById(decoded.id);

    next();
});

//authorize role
export const authorizeRoles = (...roles) => {
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(
                new ErrorHandler(
                    `Role (${req.user.role})is not allowed to access this resource`,403
                )
            )
        }
        next();
    }
}